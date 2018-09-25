#NoTrayIcon
#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Outfile=H:\web-client\GetDrive.exe
#AutoIt3Wrapper_Change2CUI=y
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****
#include <AutoItConstants.au3>
#include <MsgBoxConstants.au3>
#include <Array.au3>
#include "usb.au3"

Local $aDrives, $aDevInfo

$aDrives = DriveGetDrive("ALL") ; returns array of 'drive:' with lower-case letters
If @error Then Exit

Dim $aDriveStates[$aDrives[0] + 1][9]

For $i = 1 To $aDrives[0]
	$aDriveStates[$i][0] = '{"Drive":"' & StringReplace(StringUpper($aDrives[$i]), ':', '') & '",'
	$aDriveStates[$i][1] = _DriveGetPowerState($aDrives[$i])
	If @error Then
		$aDriveStates[$i][1] = '"APS":"Unknown",'
	Else
		$aDriveStates[$i][1] = '"APS":"' & $aDriveStates[$i][1] & '",'
	EndIf

	$aDriveStates[$i][2] = '"DriveType":"' & DriveGetType(StringUpper($aDrives[$i])) & '",'

	$aDriveStates[$i][3] = DriveGetFileSystem($aDrives[$i])
	$aDriveStates[$i][3] = ($aDriveStates[$i][3] = '') ? '"FS":"NA",' : '"FS":"' & $aDriveStates[$i][3] & '",'

	If ($aDriveStates[$i][3] <> '"FS":"NA",' And $aDriveStates[$i][2] <> '"DriveType":"CDROM",') Then
		Local $driveArray = _QueryDrive(StringReplace(StringUpper($aDrives[$i]), ':', ''))
		Local $b = (_IsUSBFlash($driveArray) ? 'USB-Flash' : (_IsUSBHDD($driveArray) ? 'USB-HDD' : 'Fixed'))
		$aDriveStates[$i][2] = '"DriveType":"' & $b & '",'
	EndIf
	Local $DSF, $DST, $DUS
	$DSF = DriveSpaceFree($aDrives[$i])
	$DST = DriveSpaceTotal($aDrives[$i])
	$DUS = $DST - $DSF
	If ($DST <> 0) Then
		$DPER = ($DUS / $DST) * 100
	Else
		$DPER = 0
	EndIf

	$aDriveStates[$i][4] = '"FreeSpace":"' & $DSF & '",'
	$aDriveStates[$i][5] = '"TotalSpace":"' & $DST & '",'
	$aDriveStates[$i][6] = '"UsedSpace":"' & $DUS & '",'
	$aDriveStates[$i][7] = '"Percentage":"' & $DPER & '",'
	$aDriveStates[$i][8] = DriveGetLabel($aDrives[$i])
	$aDriveStates[$i][8] = (StringLen($aDriveStates[$i][8]) = 0) ? '"Label":"NA"' : '"Label":"' & $aDriveStates[$i][8] & '"'

	;_ArrayDisplay($a, $aDrives[$i])
Next

ConsoleWrite('[' & _ArrayToString($aDriveStates, "", 1, Default, '},' & @CRLF) & '}]' & @CRLF)

Func _DriveGetPowerState($sDrive)
	$sDrive = StringLeft($sDrive, 1)
	If StringIsAlpha($sDrive) = 0 Then Return SetError(1, 0, -1)
	Local $iErr, $aRet, $hDisk, $sDevicePath = '\\.\' & $sDrive & ':'
	$aRet = DllCall('kernel32.dll', 'handle', 'CreateFileW', 'wstr', $sDevicePath, 'dword', 0, 'dword', 3, 'ptr', 0, 'dword', 3, 'dword', 0, 'ptr', 0)
	If @error Then Return SetError(2, @error, -1)
	If $aRet[0] = -1 Then Return SetError(3, 0, -1)
	$hDisk = $aRet[0]
	$aRet = DllCall('kernel32.dll', 'bool', 'GetDevicePowerState', 'handle', $hDisk, 'bool*', 0)
	$iErr = @error
	DllCall('kernel32.dll', 'bool', 'CloseHandle', 'handle', $hDisk)
	; Error with GetDevicePowerState call?
	If $iErr Then Return SetError(2, $iErr, -1)
	If Not $aRet[0] Then Return SetError(3, 0, -1)
	Return ($aRet[2] <> 0)
EndFunc   ;==>_DriveGetPowerState
