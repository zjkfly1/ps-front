#!/bin/bash

###############################################
# PluckStar 前端项目 PM2 启动脚本
# 使用 PM2 进程管理器（推荐用于生产环境）
###############################################

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 配置
APP_NAME="pluckstar-frontend"
PORT=3000
DIST_DIR="dist"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PluckStar 使用 PM2 启动${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查 dist 目录是否存在
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}错误: $DIST_DIR 目录不存在${NC}"
    echo -e "${YELLOW}请先运行构建脚本: ./deploy.sh${NC}"
    exit 1
fi

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 未安装，正在安装...${NC}"
    npm install -g pm2
fi

# 检查 serve 是否安装
if ! command -v serve &> /dev/null; then
    echo -e "${YELLOW}serve 未安装，正在安装...${NC}"
    npm install -g serve
fi

# 停止已存在的应用
if pm2 list | grep -q "$APP_NAME"; then
    echo -e "${YELLOW}停止已存在的应用...${NC}"
    pm2 delete "$APP_NAME"
fi

# 启动应用
echo -e "${GREEN}启动应用...${NC}"
pm2 start serve --name "$APP_NAME" -- -s "$DIST_DIR" -l "$PORT"

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启动（仅首次需要）
if ! pm2 startup | grep -q "already been configured"; then
    echo -e "${YELLOW}设置 PM2 开机自启动...${NC}"
    pm2 startup
fi

# 显示状态
echo -e "${GREEN}========================================${NC}"
pm2 status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}应用启动成功！${NC}"
echo -e "${YELLOW}访问地址: http://localhost:$PORT${NC}"
echo -e "${YELLOW}查看日志: pm2 logs $APP_NAME${NC}"
echo -e "${YELLOW}停止应用: pm2 stop $APP_NAME${NC}"
echo -e "${YELLOW}重启应用: pm2 restart $APP_NAME${NC}"
echo -e "${GREEN}========================================${NC}"

