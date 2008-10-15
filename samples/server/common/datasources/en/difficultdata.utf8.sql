# ---------- MdbToMySQL XP 0.9 MySQL IMPORT FROM `C:\Data\vss\Components\EBACombo\v32\Test\Lib\Common\Datasources\en\difficultdata.mdb` ----------


# ---------- DROP TABLE `tblData` BEFORE (RE)CREATION ----------

DROP TABLE IF EXISTS `tblData`;

# ---------- CREATE TABLE `tblData` ----------

CREATE TABLE `tblData` (
	`Id` INT NULL AUTO_INCREMENT,
	`Text` VARCHAR(50) NULL,
	KEY `Id` (`Id`)
) TYPE=MyISAM;

# ---------- EMPTY TABLE `tblData` ----------

DELETE FROM `tblData`;

# ---------- POPUPLATE TABLE `tblData` ----------

INSERT INTO `tblData` (`Id`, `Text`) VALUES (1007, '~');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1008, '`');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1009, '!');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1010, '@');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1011, '#');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1012, '$');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1013, '%');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1014, '^');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1015, '&');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1016, '*');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1017, '(');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1018, ')');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1019, '_');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1020, '-');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1021, '+');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1022, '=');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1023, '{');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1024, '}');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1025, '[');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1026, ']');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1027, '\\');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1028, '|');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1029, ':');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1030, ';');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1031, '"');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1032, '\'');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1033, '<');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1034, '>');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1035, ',');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1036, '.');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1037, '?');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1038, '/');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1039, '"\'');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1040, 'a~');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1041, 'a`');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1042, 'a!');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1043, 'a@');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1044, 'a#');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1045, 'a$');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1046, 'a%');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1047, 'a^');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1048, 'a&');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1049, 'a*');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1050, 'a(');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1051, 'a)');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1052, 'a_');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1053, 'a-');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1054, 'a+');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1055, 'a=');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1056, 'a{');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1057, 'a}');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1058, 'a|');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1059, 'a:');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1060, 'a"');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1061, 'a\'');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1062, 'a"\'');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1063, 'a<');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1064, 'a>');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1065, 'a<>');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1066, 'a""');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1067, 'a?');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1068, 'a/');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1069, 'aÜ<>&');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1071, 'aÜa');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1072, 'Entity Amp: &amp;');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1073, 'Entity GT: &gt;');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1074, 'Entity LT: &lt;');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1075, 'Entity NBSP: &nbsp;');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1076, 'Entity QUOT: &quot;');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1077, 'aâ');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1078, 'bâ');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1079, 'b&â');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1080, 'â');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1001, '&');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1002, '"');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1003, '\'');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1004, '<');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1005, '>');
INSERT INTO `tblData` (`Id`, `Text`) VALUES (1006, '<"Jack & Jill"/> own\'s data.');

# ---------- END OF IMPORT FROM `C:\Data\vss\Components\EBACombo\v32\Test\Lib\Common\Datasources\en\difficultdata.mdb` ----------
