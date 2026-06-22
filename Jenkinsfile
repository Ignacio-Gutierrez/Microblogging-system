pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(name: 'PUBLISH_DOCKER_IMAGES', defaultValue: true, description: 'Build and publish backend/frontend Docker images to DockerHub.')
        booleanParam(name: 'RUN_DOCKER_SMOKE', defaultValue: false, description: 'Start the docker compose stack and check the health endpoints.')
    }

    environment {
        DOCKERHUB_NAMESPACE = 'ijgutierrez'
        BACKEND_IMAGE = "${DOCKERHUB_NAMESPACE}/microblogging-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_NAMESPACE}/microblogging-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Tooling') {
            steps {
                sh '''
                    java -version
                    node --version
                    npm --version
                    docker --version
                    docker compose version
                '''
            }
        }

        stage('Backend - Test') {
            steps {
                dir('backend') {
                    sh '''
                        chmod +x mvnw
                        ./mvnw -ntp -Dskip.installnodenpm -Dskip.npm verify
                    '''
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/**/target/surefire-reports/TEST-*.xml,backend/**/target/failsafe-reports/TEST-*.xml'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Docker Login') {
            when {
                expression { params.PUBLISH_DOCKER_IMAGES }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-login',
                    usernameVariable: 'DOCKER_REGISTRY_USER',
                    passwordVariable: 'DOCKER_REGISTRY_PWD'
                )]) {
                    sh '''
                        echo "$DOCKER_REGISTRY_PWD" | docker login -u "$DOCKER_REGISTRY_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Backend - Publish Docker Image') {
            when {
                expression { params.PUBLISH_DOCKER_IMAGES }
            }
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-login',
                        usernameVariable: 'DOCKER_REGISTRY_USER',
                        passwordVariable: 'DOCKER_REGISTRY_PWD'
                    )]) {
                        sh './mvnw -ntp -Pprod -DskipTests -Ddockerhub.namespace=${DOCKERHUB_NAMESPACE} verify jib:build'
                    }
                }
            }
        }

        stage('Frontend - Publish Docker Image') {
            when {
                expression { params.PUBLISH_DOCKER_IMAGES }
            }
            steps {
                dir('frontend') {
                    sh '''
                        docker build -t ${FRONTEND_IMAGE}:latest .
                        docker push ${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Docker Compose - Smoke Test') {
            when {
                expression { params.RUN_DOCKER_SMOKE }
            }
            steps {
                sh '''
                    docker compose up -d --wait
                    curl -fsS http://127.0.0.1:8080/management/health
                    curl -fsS http://127.0.0.1:8081/
                '''
            }
            post {
                always {
                    sh 'docker compose down -v'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts allowEmptyArchive: true, artifacts: 'backend/target/*.jar'
        }
    }
}
