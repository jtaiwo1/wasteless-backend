pipeline {
    agent any
    stages {
        stage('Test')                { steps { echo 'Add Jest here' } }
        stage('Build Docker Images') { steps { echo 'Build three images here' } }
        stage('Push Docker Images')  { steps { echo 'Push tested images here' } }
        stage('Terraform')           { steps { echo 'Plan, approve, apply later' } }
        stage('Deploy')              { steps { echo 'Update the running VM later' } }
    }
}
