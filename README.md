# TRAILAPP

TRAILAPP is a full-stack web application consisting of a Vue.js frontend and a Node.js backend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) (optional, for containerization)

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone this repository:
   ```sh
   git clone https://github.com/ericet/TRAILAPP.git
2. Navigate to the project directory:
    ```sh
   cd TRAILAPP
3. Install frontend and backend dependencies:
   ```sh
   cd Frontend
   npm install
   cd ../Backend
   npm install

## Usage

To run the application locally, follow these steps:

1. Start the frontend:
    ```sh
    cd Frontend
    npm run serve

2. Start the backend:
    ```sh
    cd Backend
    npm start

Access the frontend at http://localhost:8080 and the backend at http://localhost:5000.

## Docker
To run the application using Docker:

1. Build the frontend and backend images:
    ```sh
    docker-compose build

2. Start the containers:
    ```sh
    docker-compose up -d

Access the frontend at http://localhost:8080 and the backend at http://localhost:5000.

## Contributing

Contributions are welcome! To contribute to this project:

1. Fork this repository.
2. Create a new branch for your feature/fix: git checkout -b feature/my-feature.
3. Commit your changes: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Create a pull request.

## License
This project is licensed under the [MIT License](https://chat.openai.com/c/LICENSE).

---

# TRAILAPP

TRAILAPP是一个全栈Web应用程序，包括Vue.js前端和Node.js后端。

## 目录

- [先决条件](#先决条件)
- [入门](#入门)
- [用法](#用法)
- [配置](#配置)
- [Docker](#Docker)
- [贡献](#贡献)
- [许可证](#许可证)

## 先决条件

在开始之前，请确保满足以下要求：

- [Node.js](https://nodejs.org/)（版本16或更高版本）
- [Docker](https://www.docker.com/)（可选，用于容器化）

## 入门

要在本地运行副本，请按照以下步骤进行操作：

1. 克隆此存储库：
   ```sh
   git clone https://github.com/ericet/TRAILAPP.git
2. 进入项目目录：
    ```sh
   cd TRAILAPP
3. 安装前端和后端的依赖项：
   ```sh
   cd Frontend
   npm install
   cd ../Backend
   npm install

## 用法

要在本地运行应用程序，请按照以下步骤进行操作：

1. 启动前端：
    ```sh
    cd Frontend
    npm run serve

2. 启动后端：
    ```sh
    cd Backend
    npm start

在http://localhost:8080上访问前端，在http://localhost:5000上访问后端。

## Docker

要使用Docker运行应用程序，请按照以下步骤进行操作：

1. 构建前端和后端镜像：
    ```sh
    docker-compose build

2. 启动容器：
    ```sh
    docker-compose up -d

在http://localhost:8080上访问前端，在http://localhost:5000上访问后端。

## 贡献

欢迎贡献！要为此项目做出贡献：

1. 分叉此存储库。
2. 为您的功能/修复创建新分支：git checkout -b feature/my-feature。
3. 提交更改：`git commit -am '添加一些功能'`。
4. 推送分支：`git push origin feature/my-feature`。
5. 创建拉取请求。

## 许可证

本项目根据[MIT许可证](https://chat.openai.com/c/LICENSE)许可。
