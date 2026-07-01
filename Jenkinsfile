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
                        sh '''
                            ./mvnw -ntp -Pprod -DskipTests verify jib:build \
                            -Djib.to.image=${BACKEND_IMAGE}:latest \
                            -Djib.to.auth.username=$DOCKER_REGISTRY_USER \
                            -Djib.to.auth.password=$DOCKER_REGISTRY_PWD
                        '''
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
                        FRONTEND_VERSION=$(node -p "require('./package.json').version")
                        docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${FRONTEND_VERSION} .
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${FRONTEND_VERSION}
                    '''
                }
            }
        }

        stage('Update DockerHub Description') {
            when {
                expression { params.PUBLISH_DOCKER_IMAGES }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-login',
                    usernameVariable: 'DOCKER_REGISTRY_USER',
                    passwordVariable: 'DOCKER_REGISTRY_PWD'
                )]) {
                    script {
                        def token = sh(
                            script: """
                                curl -s -X POST https://hub.docker.com/v2/users/login/ \
                                    -H "Content-Type: application/json" \
                                    -d '{"username":"'${DOCKER_REGISTRY_USER}'","password":"'${DOCKER_REGISTRY_PWD}'"}' | jq -r .token
                            """,
                            returnStdout: true
                        ).trim()

                        // Build JSON payload for backend
                        def backendDesc = sh(
                            script: """jq -n --arg desc "API REST de microblogging con Spring Boot, MariaDB, JWT y ELK Stack" --arg full "\$(cat backend/DOCKERHUB_README.md)" '{"description": \$desc, "full_description": \$full}'""",
                            returnStdout: true
                        ).trim()
                        writeFile(file: 'backend_dockerhub.json', text: backendDesc)

                        // Build JSON payload for frontend
                        def frontendDesc = sh(
                            script: """jq -n --arg desc "Frontend PWA de microblogging con Ionic y Angular" --arg full "\$(cat frontend/DOCKERHUB_README.md)" '{"description": \$desc, "full_description": \$full}'""",
                            returnStdout: true
                        ).trim()
                        writeFile(file: 'frontend_dockerhub.json', text: frontendDesc)

                        sh """
                            curl -s -X PATCH https://hub.docker.com/v2/repositories/${BACKEND_IMAGE}/ \
                                -H "Content-Type: application/json" \
                                -H "Authorization: JWT ${token}" \
                                -d @backend_dockerhub.json

                            curl -s -X PATCH https://hub.docker.com/v2/repositories/${FRONTEND_IMAGE}/ \
                                -H "Content-Type: application/json" \
                                -H "Authorization: JWT ${token}" \
                                -d @frontend_dockerhub.json

                            rm -f backend_dockerhub.json frontend_dockerhub.json
                        """
                    }
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
