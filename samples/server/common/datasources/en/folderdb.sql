# ---------- MdbToMySQL XP 0.9 MySQL IMPORT FROM `C:\\Data\\vss\\Components\\EBACombo\\v32\\Test\\Lib\\Common\\Datasources\\en\\folderdb.mdb` ----------


# ---------- DROP TABLE `tblFolderInfo` BEFORE (RE)CREATION ----------

DROP TABLE IF EXISTS `tblFolderInfo`;

# ---------- CREATE TABLE `tblFolderInfo` ----------

CREATE TABLE `tblFolderInfo` (
	`FolderID` INT NOT NULL AUTO_INCREMENT,
	`FolderAbsolute` TEXT NULL,
	`AccessAttempts` INT NULL DEFAULT '0',
	PRIMARY KEY (`FolderID`),
	KEY `FolderID` (`FolderID`)
) TYPE=MyISAM;

# ---------- EMPTY TABLE `tblFolderInfo` ----------

DELETE FROM `tblFolderInfo`;

# ---------- POPUPLATE TABLE `tblFolderInfo` ----------

INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (69, 'e:\\Metabase', 181);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (71, 'e:\\Backup Data', 273);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (72, 'e:\\WINNT', 264);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (73, 'e:\\Program Files', 417);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (74, 'e:\\Program Files\\MSXML 4.0', 78);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (75, 'e:\\Program Files\\MSXML 4.0\\inc', 13);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (76, 'e:\\Program Files\\Outlook Express', 69);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (77, 'e:\\Program Files\\eBusiness Applications', 89);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (78, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2', 87);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (79, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer', 81);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (80, 'e:\\Program Files\\ComPlus Applications', 40);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (81, 'e:\\Inetpub', 623);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (82, 'e:\\Inetpub\\ftproot', 83);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (83, 'e:\\Inetpub\\mailroot', 66);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (84, 'e:\\Inetpub\\mailroot\\Mailbox', 8);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (85, 'e:\\Inetpub\\wwwroot', 327);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (86, 'e:\\WINNT\\twain_32', 29);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (87, 'e:\\WINNT\\Web', 50);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (88, 'e:\\WINNT\\twain_32\\miitwain', 10);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (89, 'e:\\WINNT\\system32', 33);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (90, 'e:\\PHP', 332);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (91, 'e:\\PHP\\sessiondata', 44);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (92, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\bin', 17);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (93, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\bin\\styles', 11);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (94, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\bin\\styles\\default', 9);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (95, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples', 41);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (96, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\accessdb', 11);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (97, 'e:\\PHP\\uploadtemp', 47);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (98, 'e:\\Inetpub\\wwwroot\\aspnet_client', 57);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (99, 'e:\\Inetpub\\wwwroot\\aspnet_client\\system_web', 42);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (100, 'e:\\Inetpub\\wwwroot\\aspnet_client\\system_web\\1_1_4322', 31);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (101, 'e:\\Program Files\\MSXML 4.0\\doc', 16);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (102, 'e:\\PHP\\BACKUP', 53);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (103, 'e:\\Inetpub\\iissamples', 63);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (104, 'e:\\Inetpub\\iissamples\\sdk', 48);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (105, 'e:\\Inetpub\\iissamples\\sdk\\admin', 15);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (106, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs', 16);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (107, 'e:\\Inetpub\\wwwroot\\images', 35);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (108, 'e:\\RECYCLER', 159);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (109, 'e:\\Inetpub\\mailroot\\Pickup', 9);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (110, 'e:\\RECYCLER\\S-1-5-21-1060284298-1078081533-839522115-500', 65);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (111, 'e:\\Inetpub\\scripts', 38);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (112, 'e:\\WINNT\\Temp', 19);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (113, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\gridapi_html', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (114, 'e:\\WINNT\\Temp\\Temporary Internet Files', 7);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (115, 'e:\\WINNT\\Temp\\Temporary Internet Files\\Content.IE5', 12);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (116, 'e:\\WINNT\\Temp\\Temporary Internet Files\\Content.IE5\\4HUBGPIF', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (117, 'e:\\WINNT\\Temp\\Temporary Internet Files\\Content.IE5\\C1QZOPE7', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (118, 'e:\\WINNT\\Temp\\Cookies', 4);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (119, 'e:\\Inetpub\\wwwroot\\_vti_txt', 7);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (120, 'e:\\Inetpub\\iissamples\\sdk\\asp', 35);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (121, 'e:\\Inetpub\\iissamples\\sdk\\asp\\components', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (122, 'e:\\WINNT\\PHP', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (123, 'e:\\Inetpub\\AdminScripts', 63);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (124, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\clientpricing', 25);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (125, 'e:\\WINNT\\Windows Update Setup Files', 31);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (126, 'e:\\WINNT\\Web\\Wallpaper', 27);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (127, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\clientpricing\\resources', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (128, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\clientpricing\\styles', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (129, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\clientpricing\\styles\\default', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (130, 'e:\\Inetpub\\iissamples\\sdk\\asp\\database', 11);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (131, 'e:\\Program Files\\MSXML 4.0\\lib', 13);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (132, 'e:\\WINNT\\Tasks', 9);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (133, 'e:\\Inetpub\\wwwroot\\_vti_cnf', 6);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (134, 'e:\\WINNT\\twain_32\\logiscan', 6);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (135, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\clientpricing\\data', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (136, 'e:\\Inetpub\\wwwroot\\_private', 9);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (137, 'e:\\Inetpub\\iissamples\\sdk\\asp\\docs', 9);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (138, 'e:\\Inetpub\\wwwroot\\_vti_pvt', 8);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (139, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\grid_html', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (140, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\grid_html\\src', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (141, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\grid_html\\src\\src', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (142, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\grid_html\\src\\src\\images', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (143, 'e:\\Inetpub\\iissamples\\sdk\\asp\\interaction', 7);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (144, 'e:\\Inetpub\\wwwroot\\_vti_script', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (145, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\gridtag_html', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (146, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\gridtag_html\\source', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (147, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\gridtag_html\\source\\src', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (148, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\accessdb\\data', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (149, 'e:\\Inetpub\\mailroot\\Route', 7);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (150, 'e:\\Inetpub\\mailroot\\Badmail', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (151, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\XMLToolsAPI_html', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (152, 'e:\\Inetpub\\mailroot\\Queue', 6);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (153, 'e:\\Inetpub\\images', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (154, 'e:\\WINNT\\twain_32\\fjscan', 4);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (155, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\ReadMe', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (156, 'e:\\Inetpub\\wwwroot\\_vti_log', 5);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (157, 'e:\\Inetpub\\mailroot\\Drop', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (158, 'e:\\WINNT\\Web\\printers', 19);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (159, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\samples\\accessdb\\resources', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (160, 'e:\\WINNT\\Temp\\Temporary Internet Files\\Content.IE5\\OL2ZK92F', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (161, 'e:\\Inetpub\\iissamples\\sdk\\asp\\simple', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (162, 'e:\\Inetpub\\iissamples\\sdk\\asp\\transactional', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (163, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\XMLToolsAPI_html\\source', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (164, 'e:\\Program Files\\eBusiness Applications\\Grid 2.2\\Asp Developer\\docs\\XMLToolsAPI_html\\files', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (165, 'e:\\WINNT\\Web\\printers\\images', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (166, 'e:\\Inetpub\\mailroot\\SortTemp', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (167, 'e:\\WINNT\\Temp\\Temporary Internet Files\\Content.IE5\\4T634PIJ', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (168, 'e:\\Inetpub\\iissamples\\sdk\\asp\\applications', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (169, 'e:\\WINNT\\twain_32\\fjscan\\fcpa', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (170, 'e:\\', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (171, 'e:\\TEMP', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (172, 'e:\\TEMP\\hound_objects', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (173, 'e:\\TEMP\\houndIT', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (174, 'e:\\TEMP\\houndITbog', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (175, 'e:\\TEMP\\hound_applets', 2);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (176, 'e:\\TEMP\\houndITpak', 3);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (177, 'e:\\TEMP\\houndIT_icons', 1);
INSERT INTO `tblFolderInfo` (`FolderID`, `FolderAbsolute`, `AccessAttempts`) VALUES (178, 'e:\\TEMP\\houndITinstaller', 2);

# ---------- END OF IMPORT FROM `C:\\Data\\vss\\Components\\EBACombo\\v32\\Test\\Lib\\Common\\Datasources\\en\\folderdb.mdb` ----------
