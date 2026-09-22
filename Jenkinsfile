pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "WasteLess repository checked out"
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('db') {
                    sh 'docker build --platform linux/amd64 -t $IMAGE_NAME_DB:$IMAGE_TAG .'
                    sh 'docker build --platform linux/amd64 -t $IMAGE_NAME_DB:latest .'
                }
                dir('server') {
                    sh 'docker build --platform linux/amd64 -t $IMAGE_NAME_MVC:$IMAGE_TAG .'
                    sh 'docker build --platform linux/amd64 -t $IMAGE_NAME_MVC:latest .'
                }
                dir('insights') {
                    sh 'docker build --platform linux/amd64 -t $IMAGE_NAME_INSIGHTS:$IMAGE_TAG'
                    sh 'docker build --platform linux/amd64 -t $IMAGE_NAME_INSIGHTS:latest'
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline successful!"
        }

        failure {
            echo "Pipeline failed!"
        }
    }
}