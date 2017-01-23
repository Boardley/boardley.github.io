OS := ${shell unname}
all:
		
	ifeq ${OS} Darwin
		# Install dependencies on OSX
	else
		sudo apt-get update
		apt-get install -y zlib1g-dev ruby ruby-dev build-essential
		curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash 
		sudo apt-get install -y nodejs
		gem install jekyll bundler
		bundler update
		bundler install
		sudo npm install -g gulp
		npm install
	endif

test:
	gulp serve
