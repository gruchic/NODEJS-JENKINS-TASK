pipeline {
    agent any
    tools { nodejs 'Node16' } // Use Node.js version configured in Jenkins
    environment {
        APP_DIR = '/home/ubuntu/my-node-app'
        BACKUP_DIR = '/home/ubuntu/my-node-app-backup'
        STAGING_SERVER = "${env.STAGING_IP}"
        SSH_CREDS = 'staging-ssh-credentials'
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/gruchic/NODEJS-JENKINS-TASK.git', branch: 'main'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'echo Building the app...' // Add build steps if needed
            }
        }
        stage('Deploy to Staging') {
            steps {
                script {
                    // SSH into EC2 and deploy
                    sshagent([env.SSH_CREDS]) {
                        // Backup existing app
                        sh "ssh -o StrictHostKeyChecking=no ubuntu@${STAGING_SERVER} 'echo SSH works!'"
                    }
                }
            }
        }
    }
   
    post {
        success {
            mail to: "${env.EMAIL_RECIPIENT}",
                 subject: "SUCCESS: Pipeline for ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Deployment to staging successful! Check it out at http://${STAGING_SERVER}:${env.APP_PORT}"
        }
        failure {
            script {
                // Rollback on failure
                sshagent([env.SSH_CREDS]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${STAGING_SERVER} '
                        if [ -d ${BACKUP_DIR} ]; then
                            rm -rf ${APP_DIR};
                            mv ${BACKUP_DIR} ${APP_DIR};
                            cd ${APP_DIR} &&
                            npm install &&
                            pm2 stop my-node-app || true &&
                            pm2 start src/app.js --name my-node-app;
                        fi'
                    """
                }
            }
            mail to: "${env.EMAIL_RECIPIENT}",
                 subject: "FAILURE: Pipeline for ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Deployment failed. Rolled back to previous state."
        }
    }
}