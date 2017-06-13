# Video-Conference
Live Video Conference sample demo application setup:-

Introduction:-
		We are going to setup this video conference environment on Ubuntu operating system. Let’s see the versions needed for installation process.

Installation requirements:-
1. Ubuntu OS version 14.04 Trusty.
2. NPM initialization.
3. Node JS minimum version is 0.10.

Ubuntu installation:-
		We must have our pc gets installed with Ubuntu operating system minimum version 14.04 trusty.
NodeJS installation:-
Step-1:	NodeJS can be downloaded in the following website https://www.nodejs.org.

Step-2:	Or we can download via Ubuntu terminal.
		$ sudo apt-get install nodejs

Step-3:	If we want to install nodejs packages,we need to use the following command.
		$ npm install packagename for normal user or $sudo npm install packagename for superuser (for local installation of the package)
		or
		Ex: $ sudo npm install socket.io
		$sudo npm install –g packagename(for global installation of the package)
		Ex: $ sudo npm install –g socket.io

Booting the server:
1. After the installation of the nodejs just open the terminal and go to the project folder and run the server.js file to boot the server.

2. Type the following command.

$ node server.js

The above command will boot the nodejs server.
		
3. Open the browser give your system IP address or localhost   followed by port no(8000) hit enter then you will get your home page. That’s it.
