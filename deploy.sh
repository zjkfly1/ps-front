#!/bin/bash

###############################################
# PluckStar 前端项目生产环境部署脚本
###############################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PluckStar 前端项目部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装，请先安装 Node.js${NC}"
    exit 1
fi

echo -e "${YELLOW}当前 Node.js 版本: $(node -v)${NC}"
echo -e "${YELLOW}当前 npm 版本: $(npm -v)${NC}"

# 安装依赖
echo -e "${GREEN}[1/4] 安装项目依赖...${NC}"
npm install

# 构建生产版本
echo -e "${GREEN}[2/4] 构建生产版本...${NC}"
npm run build:prod

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo -e "${RED}错误: 构建失败，dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}[3/4] 构建成功！${NC}"
echo -e "${YELLOW}构建输出目录: $(pwd)/dist${NC}"

# 显示构建文件大小
echo -e "${YELLOW}构建文件大小:${NC}"
du -sh dist/

# 提示部署选项
echo -e "${GREEN}[4/4] 部署选项:${NC}"
echo -e "${YELLOW}1. 使用 Nginx 部署（推荐）${NC}"
echo -e "   - 将 dist 目录复制到 Nginx 的 web 根目录"
echo -e "   - 参考 nginx.conf 配置文件"
echo -e ""
echo -e "${YELLOW}2. 使用 Node.js 静态服务器${NC}"
echo -e "   - 运行: ./start-prod.sh"
echo -e ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署准备完成！${NC}"
echo -e "${GREEN}========================================${NC}"

