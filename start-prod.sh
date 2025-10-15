#!/bin/bash

###############################################
# PluckStar 前端项目生产环境启动脚本
# 使用 Node.js 静态服务器（serve）
###############################################

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 配置
PORT=3000
HOST="0.0.0.0"
DIST_DIR="dist"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PluckStar 生产环境启动${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查 dist 目录是否存在
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}错误: $DIST_DIR 目录不存在${NC}"
    echo -e "${YELLOW}请先运行构建脚本: ./deploy.sh${NC}"
    exit 1
fi

# 检查 serve 是否安装
if ! command -v serve &> /dev/null; then
    echo -e "${YELLOW}serve 未安装，正在安装...${NC}"
    npm install -g serve
fi

echo -e "${GREEN}启动生产服务器...${NC}"
echo -e "${YELLOW}端口: $PORT${NC}"
echo -e "${YELLOW}主机: $HOST${NC}"
echo -e "${YELLOW}目录: $DIST_DIR${NC}"
echo -e "${GREEN}========================================${NC}"

# 启动服务
serve -s "$DIST_DIR" -l "$PORT" --host "$HOST"

