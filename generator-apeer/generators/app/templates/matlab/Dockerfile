FROM ubuntu:16.04

# make sure the matlab release and the runtime point to the same version
# check the matlab release/runtime versions here: https://www.mathworks.com/products/compiler/matlab-runtime.html
ENV MATLAB_RELEASE  R2018b
ENV MCR_VERSION     v95

# install required system packages
RUN apt-get update -y && apt-get install -y \
    wget \
    unzip \
    openjdk-8-jdk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/jre

# install matlab runtime
RUN mkdir /root/mcr && \
    cd /root/mcr && \
    wget -nv http://ssd.mathworks.com/supportfiles/downloads/${MATLAB_RELEASE}/deployment_files/${MATLAB_RELEASE}/installers/glnxa64/MCR_${MATLAB_RELEASE}_glnxa64_installer.zip && \
    unzip MCR_${MATLAB_RELEASE}_glnxa64_installer.zip && \
    mkdir /opt/matlab-compiler-runtime && \
    ./install -mode silent -agreeToLicense yes -destinationFolder /opt/matlab-compiler-runtime && \
    cd / && \
    rm -rf /root/mcr

# add matlab runtime to library path
ENV LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:\
/opt/matlab-compiler-runtime/${MCR_VERSION}/runtime/glnxa64:\
/opt/matlab-compiler-runtime/${MCR_VERSION}/bin/glnxa64:\
/opt/matlab-compiler-runtime/${MCR_VERSION}/sys/os/glnxa64

#### YOUR CODE ####
WORKDIR /app
COPY bin/apeer_main .
CMD [ "./apeer_main" ]
