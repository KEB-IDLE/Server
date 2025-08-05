pipeline {
    agent any

    environment {
        IMAGE_NAME = "myserver"
        DOCKERHUB_TAG = "jamsik/myserver:latest"
        REMOTE_USER = "ubuntu"
        REMOTE_HOST = "13.61.174.133" // ✨ 여기에 EC2 퍼블릭 IP 입력
        REMOTE_DIR = "/home/ubuntu"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('server') {
                    sh """
                        docker build -t ${IMAGE_NAME} .
                        docker tag ${IMAGE_NAME} ${DOCKERHUB_TAG}
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKERHUB_TAG}
                    """
                }
            }
        }

        stage('Deploy to EC2 via SSH') {
            steps {
                sshagent (credentials: ['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
                            docker pull ${DOCKERHUB_TAG} &&
                            docker-compose -f ${REMOTE_DIR}/docker-compose.yml down &&
                            docker-compose -f ${REMOTE_DIR}/docker-compose.yml up -d
                        '
                    """
                }
            }
        }
    }
}
