# FileTransfer
1: Transfer Files from Remote system using Browser 

2: Tested on Linux / Win32 (W2k3/Win7)

3: For accessing the Remote machine's File-System through Internet use ngork. (ngork http 4002)

# ToDo
1: Working on an alternative for ngork as http/s is accessible through NAT , but facing issues with web-sockets which are used by SFTP-WS.

2: Clean-up the code.

3: Test on Mac.

# Thanks
SFTP-WS : https://github.com/lukaaash/sftp-ws.git

Windows 10 Metro UI based on CSS : https://codepen.io/keithpickering/pen/azBdNj

Metro UI - you will need to completely rewrite the UI : https://metroui.org.ua/

# Note
1: Node Version on Windows : 4.9.x (The last version of node to work on all the versions of Windows)

2: Autoit Version 3.3.12.0 has been used to compile the GetDrive.au3 and DOES NOT REQUIRE Admin Priviledges.

3: Network Shares might not be visible - https://www.easeus.com/storage-media-recovery/mapped-network-drive-not-showing.html modify the registry and restart the system . 

3: Linux is tricky when it comes to mount-points and program execution. Test the script, grab the console output and modify the values.
