<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" xmlns:n="http://www.nitobi.com/exslt/numbers" extension-element-prefixes="d n">
   
<!-- http://java.sun.com/j2se/1.3/docs/api/java/text/SimpleDateFormat.html -->

<d:ms>
   <d:m i="1"  l="31" a="Jan">January</d:m>
   <d:m i="2"  l="28" a="Feb">February</d:m>
   <d:m i="3"  l="31" a="Mar">March</d:m>
   <d:m i="4"  l="30" a="Apr">April</d:m>
   <d:m i="5"  l="31" a="May">May</d:m>
   <d:m i="6"  l="30" a="Jun">June</d:m>
   <d:m i="7"  l="31" a="Jul">July</d:m>
   <d:m i="8"  l="31" a="Aug">August</d:m>
   <d:m i="9"  l="30" a="Sep">September</d:m>
   <d:m i="10" l="31" a="Oct">October</d:m>
   <d:m i="11" l="30" a="Nov">November</d:m>
   <d:m i="12" l="31" a="Dec">December</d:m>
</d:ms>
<d:ds>
   <d:d a="Sun">Sunday</d:d>
   <d:d a="Mon">Monday</d:d>
   <d:d a="Tue">Tuesday</d:d>
   <d:d a="Wed">Wednesday</d:d>
   <d:d a="Thu">Thursday</d:d>
   <d:d a="Fri">Friday</d:d>
   <d:d a="Sat">Saturday</d:d>
</d:ds>
<xsl:template name="d:format-date">
   <xsl:param name="date-time" />
   <xsl:param name="mask" select="'MMM d, yy'"/>
   <xsl:param name="date-year" />
   <xsl:variable name="formatted">

            <xsl:variable name="date-time-length" select="string-length($date-time)" />
            <xsl:variable name="timezone" select="''" />

               <xsl:variable name="dt" select="substring($date-time, 1, $date-time-length - string-length($timezone))" />
               <xsl:variable name="dt-length" select="string-length($dt)" />
               <xsl:choose>
                  <xsl:when test="substring($dt, 3, 1) = ':' and
                                  substring($dt, 6, 1) = ':'">
                     <!--that means we just have a time-->
                     <xsl:variable name="hour" select="substring($dt, 1, 2)" />
                     <xsl:variable name="min" select="substring($dt, 4, 2)" />
                     <xsl:variable name="sec" select="substring($dt, 7)" />
                     <xsl:if test="$hour &lt;= 23 and
                                   $min &lt;= 59 and
                                   $sec &lt;= 60">
                        <xsl:call-template name="d:_format-date">
                           <xsl:with-param name="year" select="'NaN'" />
                           <xsl:with-param name="month" select="'NaN'" />
                           <xsl:with-param name="day" select="'NaN'" />
                           <xsl:with-param name="hour" select="$hour" />
                           <xsl:with-param name="minute" select="$min" />
                           <xsl:with-param name="second" select="$sec" />
                           <xsl:with-param name="timezone" select="$timezone" />
                           <xsl:with-param name="mask" select="$mask" />
                        </xsl:call-template>
                     </xsl:if>
                  </xsl:when>
                  <xsl:when test="substring($dt, 2, 1) = '-' or substring($dt, 3, 1) = '-'">
                     <xsl:choose>
                        <xsl:when test="$dt-length = 5 or $dt-length = 6">
                           <!--D-MMM,DD-MMM-->
                           <xsl:variable name="year" select="$date-year" />
                           <xsl:variable name="month" select="document('')/*/d:ms/d:m[@a = substring-after($dt,'-')]/@i" />
                           <xsl:variable name="day" select="substring-before($dt,'-')" />
                           <xsl:call-template name="d:_format-date">
                              <xsl:with-param name="year" select="$year" />
                              <xsl:with-param name="month" select="$month" />
                              <xsl:with-param name="day" select="$day" />
                              <xsl:with-param name="timezone" select="$timezone" />
                              <xsl:with-param name="mask" select="$mask" />
                           </xsl:call-template>
                        </xsl:when>
                        <xsl:when test="$dt-length = 8 or $dt-length = 9">
                           <!--D-MMM-YY,DD-MMM-YY-->
                           <xsl:variable name="year" select="concat('20',substring-after(substring-after($dt,'-'),'-'))" />
                           <xsl:variable name="month" select="document('')/*/d:ms/d:m[@a = substring-before(substring-after($dt,'-'),'-')]/@i" />
                           <xsl:variable name="day" select="substring-before($dt,'-')" />
                           <xsl:call-template name="d:_format-date">
                              <xsl:with-param name="year" select="$year" />
                              <xsl:with-param name="month" select="$month" />
                              <xsl:with-param name="day" select="$day" />
                              <xsl:with-param name="timezone" select="$timezone" />
                              <xsl:with-param name="mask" select="$mask" />
                           </xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
                           <!--D-MMM-YYYY,DD-MMM-YYYY-->
                           <xsl:variable name="year" select="substring-after(substring-after($dt,'-'),'-')" />
                           <xsl:variable name="month" select="document('')/*/d:ms/d:m[@a = substring-before(substring-after($dt,'-'),'-')]/@i" />
                           <xsl:variable name="day" select="substring-before($dt,'-')" />
                           <xsl:call-template name="d:_format-date">
                              <xsl:with-param name="year" select="$year" />
                              <xsl:with-param name="month" select="$month" />
                              <xsl:with-param name="day" select="$day" />
                              <xsl:with-param name="timezone" select="$timezone" />
                              <xsl:with-param name="mask" select="$mask" />
                           </xsl:call-template>
						</xsl:otherwise>
                     </xsl:choose>
                  </xsl:when>
                  <xsl:otherwise>
                  <!--($neg * -2)-->
                     <xsl:variable name="year" select="substring($dt, 1, 4) * (0 + 1)" />
                     <xsl:variable name="month" select="substring($dt, 6, 2)" />
                     <xsl:variable name="day" select="substring($dt, 9, 2)" />

                     <xsl:choose>
                        <xsl:when test="$dt-length = 10">
	                        <!--that means we just have a date-->
                           <xsl:call-template name="d:_format-date">
                              <xsl:with-param name="year" select="$year" />
                              <xsl:with-param name="month" select="$month" />
                              <xsl:with-param name="day" select="$day" />
                              <xsl:with-param name="timezone" select="$timezone" />
                              <xsl:with-param name="mask" select="$mask" />
                           </xsl:call-template>
                        </xsl:when>
                        <xsl:when test="substring($dt, 14, 1) = ':' and substring($dt, 17, 1) = ':'">
	                       <!--that means we have a date + time-->
                           <xsl:variable name="hour" select="substring($dt, 12, 2)" />
                           <xsl:variable name="min" select="substring($dt, 15, 2)" />
                           <xsl:variable name="sec" select="substring($dt, 18)" />

                           <xsl:call-template name="d:_format-date">
                              <xsl:with-param name="year" select="$year" />
                              <xsl:with-param name="month" select="$month" />
                              <xsl:with-param name="day" select="$day" />
                              <xsl:with-param name="hour" select="$hour" />
                              <xsl:with-param name="minute" select="$min" />
                              <xsl:with-param name="second" select="$sec" />
                              <xsl:with-param name="timezone" select="$timezone" />
                              <xsl:with-param name="mask" select="$mask" />
                           </xsl:call-template>

                         </xsl:when>
                      </xsl:choose>

                  </xsl:otherwise>
               </xsl:choose>

   </xsl:variable>
   <xsl:value-of select="$formatted" />   
</xsl:template>

<xsl:template name="d:_format-date">
   <xsl:param name="year" />
   <xsl:param name="month" select="1" />
   <xsl:param name="day" select="1" />
   <xsl:param name="hour" select="0" />
   <xsl:param name="minute" select="0" />
   <xsl:param name="second" select="0" />
   <xsl:param name="timezone" select="'Z'" />
   <xsl:param name="mask" select="''" />
   <xsl:variable name="char" select="substring($mask, 1, 1)" />
   <xsl:choose>
      <xsl:when test="not($mask)" />
      <!--replaced escaping with ' here/-->
      <xsl:when test="not(contains('GyMdhHmsSEDFwWakKz', $char))">
         <xsl:value-of select="$char" />
         <xsl:call-template name="d:_format-date">
            <xsl:with-param name="year" select="$year" />
            <xsl:with-param name="month" select="$month" />
            <xsl:with-param name="day" select="$day" />
            <xsl:with-param name="hour" select="$hour" />
            <xsl:with-param name="minute" select="$minute" />
            <xsl:with-param name="second" select="$second" />
            <xsl:with-param name="timezone" select="$timezone" />
            <xsl:with-param name="mask" select="substring($mask, 2)" />
         </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
         <xsl:variable name="next-different-char" select="substring(translate($mask, $char, ''), 1, 1)" />
         <xsl:variable name="mask-length">
            <xsl:choose>
               <xsl:when test="$next-different-char">
                  <xsl:value-of select="string-length(substring-before($mask, $next-different-char))" />
               </xsl:when>
               <xsl:otherwise>
                  <xsl:value-of select="string-length($mask)" />
               </xsl:otherwise>
            </xsl:choose>
         </xsl:variable>
         <xsl:choose>
            <!--took our the era designator-->
            <xsl:when test="$char = 'M'">
              <xsl:choose>
                  <xsl:when test="$mask-length >= 3">
                     <xsl:variable name="month-node" select="document('')/*/d:ms/d:m[number($month)]" />
                     <xsl:choose>
                        <xsl:when test="$mask-length >= 4">
                           <xsl:value-of select="$month-node" />
                        </xsl:when>
                        <xsl:otherwise>
                           <xsl:value-of select="$month-node/@a" />
                        </xsl:otherwise>
                     </xsl:choose>
                  </xsl:when>
                  <xsl:when test="$mask-length = 2">
                     <xsl:value-of select="format-number($month, '00')" />
                  </xsl:when>
                  <xsl:otherwise>
                     <xsl:value-of select="$month" />
                  </xsl:otherwise>
               </xsl:choose>
            </xsl:when>
            <xsl:when test="$char = 'E'">

                     <xsl:variable name="month-days" select="sum(document('')/*/d:ms/d:m[position() &lt; $month]/@l)" />
                     <xsl:variable name="days" select="$month-days + $day + boolean(((not($year mod 4) and $year mod 100) or not($year mod 400)) and $month &gt; 2)" />
                     <xsl:variable name="y-1" select="$year - 1" />
                     <xsl:variable name="dow"
                                   select="(($y-1 + floor($y-1 div 4) -
                                             floor($y-1 div 100) + floor($y-1 div 400) +
                                             $days) 
                                            mod 7) + 1" />
                     <xsl:variable name="day-node" select="document('')/*/d:ds/d:d[number($dow)]" />
                     <xsl:choose>
                        <xsl:when test="$mask-length >= 4">
                           <xsl:value-of select="$day-node" />
                        </xsl:when>
                        <xsl:otherwise>
                           <xsl:value-of select="$day-node/@a" />
                        </xsl:otherwise>
                     </xsl:choose>

            </xsl:when>
            <xsl:when test="$char = 'a'">
               <xsl:choose>
                  <xsl:when test="$hour >= 12">PM</xsl:when>
                  <xsl:otherwise>AM</xsl:otherwise>
               </xsl:choose>
            </xsl:when>
            <xsl:when test="$char = 'z'">
               <xsl:choose>
                  <xsl:when test="$timezone = 'Z'">UTC</xsl:when>
                  <xsl:otherwise>UTC<xsl:value-of select="$timezone" /></xsl:otherwise>
               </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
               <xsl:variable name="padding" select="'00'" />
               <!--removed padding-->
               <xsl:choose>
                  <xsl:when test="$char = 'y'">
                     <xsl:choose>
                        <xsl:when test="$mask-length &gt; 2"><xsl:value-of select="format-number($year, $padding)" /></xsl:when>
                        <xsl:otherwise><xsl:value-of select="format-number(substring($year, string-length($year) - 1), $padding)" /></xsl:otherwise>
                     </xsl:choose>
                  </xsl:when>
                  <xsl:when test="$char = 'd'">
                     <xsl:value-of select="format-number($day, $padding)" />
                  </xsl:when>
                  <xsl:when test="$char = 'h'">
                     <xsl:variable name="h" select="$hour mod 12" />
                     <xsl:choose>
                        <xsl:when test="$h"><xsl:value-of select="format-number($h, $padding)" /></xsl:when>
                        <xsl:otherwise><xsl:value-of select="format-number(12, $padding)" /></xsl:otherwise>
                     </xsl:choose>
                  </xsl:when>
                  <xsl:when test="$char = 'H'">
                     <xsl:value-of select="format-number($hour, $padding)" />
                  </xsl:when>
                  <xsl:when test="$char = 'k'">
                     <xsl:choose>
                        <xsl:when test="$hour"><xsl:value-of select="format-number($hour, $padding)" /></xsl:when>
                        <xsl:otherwise><xsl:value-of select="format-number(24, $padding)" /></xsl:otherwise>
                     </xsl:choose>
                  </xsl:when>
                  <xsl:when test="$char = 'K'">
                        <xsl:value-of select="format-number($hour mod 12, $padding)" />
                  </xsl:when>
                  <xsl:when test="$char = 'm'">
                     <xsl:value-of select="format-number($minute, $padding)" />
                  </xsl:when>
                  <xsl:when test="$char = 's'">
                     <xsl:value-of select="format-number($second, $padding)" />
                  </xsl:when>
                  <xsl:when test="$char = 'S'">
                     <xsl:value-of select="format-number(substring-after($second, '.'), $padding)" />
                  </xsl:when>
                  <xsl:when test="$char = 'F'">
                     <xsl:value-of select="floor($day div 7) + 1" />
                  </xsl:when>
                  <xsl:otherwise>
                     <xsl:variable name="month-days" select="sum(document('')/*/d:ms/d:m[position() &lt; $month]/@l)" />
                     <xsl:variable name="days" select="$month-days + $day + boolean(((not($year mod 4) and $year mod 100) or not($year mod 400)) and $month &gt; 2)" />
                     <xsl:value-of select="format-number($days, $padding)" />
                     <!--removed week in year-->
                     <!--removed week in month-->
                  </xsl:otherwise>
               </xsl:choose>
            </xsl:otherwise>
         </xsl:choose>
         <xsl:call-template name="d:_format-date">
            <xsl:with-param name="year" select="$year" />
            <xsl:with-param name="month" select="$month" />
            <xsl:with-param name="day" select="$day" />
            <xsl:with-param name="hour" select="$hour" />
            <xsl:with-param name="minute" select="$minute" />
            <xsl:with-param name="second" select="$second" />
            <xsl:with-param name="timezone" select="$timezone" />
            <xsl:with-param name="mask" select="substring($mask, $mask-length + 1)" />
         </xsl:call-template>
      </xsl:otherwise>
   </xsl:choose>
</xsl:template>

</xsl:stylesheet>