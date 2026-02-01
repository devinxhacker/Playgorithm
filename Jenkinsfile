pipeline{
    agent any

    environment {
        IMAGE_NAME = "kirannandi896/playgorithm"
        IMAGE_TAG = "2.0.0"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', url: 'https://github.com/devinxhacker/Playgorithm.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                script {
                    def image = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    env.IMAGE_ID = image.id
                }
            }
        }
        stage('Push Docker Image'){
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'kirannandi896-user'){
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}