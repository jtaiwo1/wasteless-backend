pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "WasteLess repository checked out"
            }
        }

        stage('Verify Workspace') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                echo "WasteLess workspace verified"
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