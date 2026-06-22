pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(name: 'BUILD_DOCKER_IMAGE', defaultValue: true, description: 'Build the backend Docker image with Jib.')
        booleanParam(name: 'RUN_DOCKER_SMOKE', defaultValue: false, description: 'Start the backend docker compose stack and check the health endpoint.')
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

        stage('Backend - Docker Image') {
            when {
                expression { params.BUILD_DOCKER_IMAGE }
            }
            steps {
                dir('backend') {
                    sh './mvnw -ntp -Pprod -DskipTests verify jib:dockerBuild'
                }
            }
        }

        stage('Docker Compose - Smoke Test') {
            when {
                expression { params.RUN_DOCKER_SMOKE }
            }
            steps {
                sh '''
                    docker compose -f backend/src/main/docker/app.yml up -d --wait
                    curl -fsS http://127.0.0.1:8080/management/health
                '''
            }
            post {
                always {
                    sh 'docker compose -f backend/src/main/docker/app.yml down -v'
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
