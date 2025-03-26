pipeline {
    agent any
    tools { nodejs 'Node16' } 
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
                sh 'echo Building the app...' 
            }
        }
        stage('Deploy to Staging') {
            steps {
                script {
                    
                    sshagent([env.SSH_CREDS]) {
                     
                      sh """
                ssh -o StrictHostKeyChecking=no ubuntu@${STAGING_SERVER} '
                    if [ -d ${APP_DIR} ]; then
                        rm -rf ${BACKUP_DIR} || true;
                        mv ${APP_DIR} ${BACKUP_DIR};
                    fi;
                    mkdir -p ${APP_DIR}'
                """
                sh "rsync -avz --progress -e 'ssh -o StrictHostKeyChecking=no' . ubuntu@${STAGING_SERVER}:${APP_DIR}"
                sh """
                ssh -o StrictHostKeyChecking=no ubuntu@${STAGING_SERVER} '
                    cd ${APP_DIR} &&
                    npm install &&
                    pm2 stop my-node-app || true &&
                    pm2 start src/app.js --name my-node-app'
                """
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
             
               // Roll Back on the failure of the Pipeline #################################################
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