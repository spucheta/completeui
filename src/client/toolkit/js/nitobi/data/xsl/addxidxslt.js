/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
var addXidxslt='<?xml version="1.0" encoding="utf-8"?> <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:eba="http://www.ebusinessapplications.ca/ebagrid#"> <x:p-x:n-startXid"x:s-100" ></x:p-> <x:t- match="@* | node()" > <xsl:copy> <x:at-x:s-@*|node()" /> </xsl:copy> </x:t-> <x:t- match="//eba:e"> <xsl:copy> <xsl:copy-ofx:s-@*" /> <xsl:attributex:n-xid"><x:v-x:s-position() + number($startXid)" /></xsl:attribute> </xsl:copy> </x:t-> </xsl:stylesheet> ';
addXidxslt=addXidxslt.replace(/x:c-/g, 'xsl:choose').replace(/x\:wh\-/g, 'xsl:when').replace(/x\:o\-/g, 'xsl:otherwise').replace(/x\:n\-/g, ' name="').replace(/x\:s\-/g, ' select="').replace(/x\:va\-/g, 'xsl:variable').replace(/x\:v\-/g, 'xsl:value-of').replace(/x\:ct\-/g, 'xsl:call-template').replace(/x\:w\-/g, 'xsl:with-param').replace(/x\:p\-/g, 'xsl:param').replace(/x\:t\-/g, 'xsl:template').replace(/x\:at\-/g, 'xsl:apply-templates')