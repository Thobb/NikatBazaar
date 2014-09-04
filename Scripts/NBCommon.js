var NBUtils = {
    sessionTimeOut: 120,  //20 minutes => 1000*60*20
    sessionTrackTime: 0,
    sessionIntervalId: 0,
    ajaxCall: function (urlPath, postdata, onsuccess, onfailed) {
        var actualData = postdata;
        if (typeof (postdata) == "object") {
            //StartSpinner(true);
            actualData = $.toJSON(postdata);
            contentType = "application/json; charset=utf-8";
            $.ajax({
                type: "POST",
                url: urlPath,
                data: actualData,
                success: onsuccess,
                contentType: contentType,
                error: function (xhr, status, errorText) {
                    //Persistent: Karuna: Show a separate msg on timeout.
                    if (status == "timeout")
                        ShowAlert("The operation has timed out. Please try again.", "NikatBazaar");
                    else {
                        if (xhr.status != null) {
                            if (xhr.status == "403")
                                ShowAlert("You do not have permissions to execute this", "NikatBazaar");
                            if (xhr.status == "500")
                                ShowExclamation();
                            if (xhr.status == "401")
                                location.href = "./Account/Login.aspx";
                        }
                    }
                    
                }
            });
        }
        else {
            
            $.ajax({
                type: "POST",
                url: urlPath,
                data: actualData,
                success: onsuccess,
                error: function (xhr, status, errorText) { if (xhr.status == "403") ShowAlert("You do not have permissions to execute this", "MediaValet"); }
            });
        }
        sessionTrackTime = 0; //When a Ajax Call is Placed then the Session is Active
    },
    ajax: function (options) {
        $.ajax(options);
    },
    ajax: function (complete) {
        $.ajax(complete);
    },
    showProgress: function (msg, flag) {
        BlockUI(msg, flag);
    },
    hideProgress: function () {
        UnblockUI();
    },
    enableTabs: function () {
        $(".page-tab-holder").show();
    },
    openPopUp: function (urlPath, title, width, height, callback) {

        if ($(urlPath).length) {
            $.nyroModalManual({
                url: urlPath,
                bgColor: '#111111',
                title: title,
                minWidth: 250,
                minHeight: 150
            });
        }
        else {
            OpenPageInPopUp(urlPath, title, width, height, callback);
        }

    },
    showAlert: function (title, message, callback) {
        jAlert(message, title, callback);
    },
    showConfirm: function (message, title, callback) {
        //  jConfirm(message, title, callback);
        jDel(message, title, callback);
    },
    popupDel: function (message, title, callback) {
        jDel(message, title, callback);
    },
    trackSessionExpire: function () {
        sessionIntervalId = setInterval("MVUtils.checkSessionExpiry()", 1000);
    },

    validation: function (idVal, evt, slno, desc, heading, space) {
        if (evt == "OnBlur") {
            if (slno == 11) {
                var alphanumSpace = /^[0-9A-Za-z\s]+$/;
                if (!(alphanumSpace.test(idVal))) {
                    parent.ShowAlert(desc, heading);
                    return false;
                }
            }
            else if (slno == 4) {
                var emailfilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
                //alert(idVal);/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (!(emailfilter.test(idVal))) {
                    parent.ShowAlert(desc, heading);
                    return false;
                }
            }
            return true;
        }
        else if (evt == "Submit") {
            if (slno == 2) {
                var numonly = /^[0-9]+$/;
                if (!(numonly.test(idVal))) {
                    parent.ShowAlert(desc, heading);
                    return false;
                }
                return true;
            }
            else {
                var alphanum = /^[0-9A-Za-z]+$/;
                if (!(alphanum.test(idVal))) {
                    parent.ShowAlert(desc, heading);
                    return false;
                }
                return true;
            }
        }
        else if (evt == "checkSpaceInSubmit") {
            var alphanumSpace = /^[0-9A-Za-z-&@._\s]+$/;
            if (!(alphanumSpace.test(idVal))) {
                parent.ShowAlert(desc, heading);
                return false;
            }
            return true;
        }
            //Persistent:Rashmi: 1277: Special charcters not allowed
            //Persistent:Shweta: 2100: Allow dot
        else if (evt == "title") {
            var charCode = (idVal.which) ? idVal.which : window.event.keyCode;
            if (!((charCode == 8) || (charCode == 46) || (charCode == 32) || (charCode == 33) || (charCode == 39) || (charCode == 40) || (charCode == 41) || (charCode == 44) || (charCode == 45) || (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122) || (charCode == 58) || (charCode == 95) || (charCode >= 192 && charCode <= 214) || (charCode >= 216 && charCode <= 246) || (charCode >= 248 && charCode <= 255)))  // NO special characters are allowed.
            {
                parent.ShowAlert(desc, heading);
                return false;
            }
            else
                return true;
        }
            //Persistent: Karuna: Fix for 1234: Check the allowable characters in keyword
        else if (idVal == "Keyword") {
            var charCode = (evt.which) ? evt.which : window.event.keyCode;
            if (!((charCode == 8) || (charCode == 32) ||
                // (charCode == 44) || // Charles - deactivated to prevent 2630 for now.
                (charCode == 45) || (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 192 && charCode <= 255))) {
                parent.ShowAlert(desc, heading);
                return false;
            }
            return true;
        } //Rahul Karn: 2419 Added validation for keyword group.
        else if (idVal == "Keyword Group") {
            var charCode = (evt.which) ? evt.which : window.event.keyCode;
            if (!((charCode == 8) || (charCode == 32) || (charCode == 45) || (charCode >= 48 && charCode <= 57) || (charCode >= 64 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 192 && charCode <= 255))) {
                parent.ShowAlert(desc, heading);
                return false;
            }
            return true;
        }
        else if (idVal == "KeywordList") { // Charles - Fix for 2326 / ',' is authorized in keyword list
            var charCode = (evt.which) ? evt.which : window.event.keyCode;
            if (!((charCode == 44) || (charCode == 8) || (charCode == 32) || (charCode == 45) || (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 192 && charCode <= 255))) {
                parent.ShowAlert(desc, heading);
                return false;
            }
            return true;
        }
            //Persistent: Karuna: Feature 383: Check the allowable characters in category
        else if (idVal == "Category") {
            var charCode = (evt.which) ? evt.which : window.event.keyCode;
            if (!((charCode == 8) || (charCode == 32) || (charCode >= 39 && charCode <= 41) || (charCode == 45) || (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode == 95) || (charCode >= 97 && charCode <= 122) || (charCode >= 192 && charCode <= 255))) {
                parent.ShowAlert(desc, heading);
                return false;
            }
            return true;
        }
        else {
            // if (window.event != undefined) {
            var charCode = (evt.which) ? evt.which : window.event.keyCode;
            if ((charCode != 8) && (charCode != 127) && (charCode != 0) && (charCode != 46) && (charCode != 13))   // NO special characters are allowed.
            {
                if (slno == 1) {
                    if (!((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
                else if (slno == 11)   //Special character are not allowed except SPACE,DOT,HYPEN,UNDERSCORE,AND OPERATOR.
                {
                    if (!((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122) || (charCode == 32) || (charCode == 38) || (charCode == 46) || (charCode == 45) || (charCode == 64) || (charCode == 95))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
                else if (slno == 12)   //Special character are not allowed except colon and semi colon.
                {
                    if (!((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122) || (charCode == 44) || (charCode == 59) || (charCode == 32))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
                else if (slno == 13)   //Alphabets with space for Name field
                {
                    if (!((charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122) || (charCode == 32))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
                else if (slno == 14)   //Special character are not allowed except SPACE,DOT,HYPEN,UNDERSCORE,AND OPERATOR,Open,close paranthesis and Squarebrackets.
                {
                    if (!((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122) || (charCode == 32) || (charCode == 38) || (charCode == 46) || (charCode == 45) || (charCode == 64) || (charCode == 95) || (charCode == 40) || (charCode == 41) || (charCode == 91) || (charCode == 93))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
                if (slno == 2) {         //Only Numbers
                    if (!((charCode >= 48 && charCode <= 57))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
                if (slno == 3) {    //Only characters
                    if (!((charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 122))) {
                        parent.ShowAlert(desc, heading);
                        evt.preventDefault();
                        evt.keyCode = 0;
                        return false;
                    }
                }
            }
            return true;
            // }          
        }
    },
    checkSessionExpiry: function () {
        if (MVUtils.sessionTrackTime >= MVUtils.sessionTimeOut) {
            MVUtils.sessionTrackTime = 0;
            clearInterval(MVUtils.sessionIntervalId);
            this.showAlert("Session Expired", "Mediavalet application session expired", function () {
                window.location = "../../Account/Login.aspx";
            });
        }
        MVUtils.sessionTrackTime++;
    },

    isInvalidCharsInSearch: function (searchText) {
        //var pattern = "[‘’‚“”„†‡‰‹›♠♥♣♦‾←→↓↑™#$%&*?@^+./;=<>`{|}~–—¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×÷]";
        //var pattern = "[‘’‚“”„†‡‰‹›♠♥♣♦‾←↑→↓™#$%&*?@^+./;=<>`{|}~–—¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×÷\\u005c\u00a0\u00ad\u000a\u0009]";

        //Persistent: Deepti. I tried \] to consider ] in expression, it was not working, but due to this the expression was not working on any browser except IE8.
        //hence removing this in below.
        //Removed: \u002A from expression, Added this as * is not allowed in Asset title and category name. but as per requirement we will allow user to search by *.
        //var pattern = "[\]\[’‚“”„†‡‰‹›♠♥♣♦‾←→↓↑™\u0023\u0024\u0025\u0026\u002A\u003F\u0040\u005E\u002B\u002E\u002F\u003B\u003D\u003C\u003E\u0060\u007B\u007C\u007D\u007E\–\—\u00A1\u00A2\u00A3\u00A4\u00A5\u00A6\u00A7\u00A8\u00A9\u00AA\u00AB\u00AC\u00AE\u00AF\u00B0\u00B1\u00B2\u00B3\u02CA\u00B5\u00B6\u00B7\u00B8\u00B9\u00BA\u00BB\u00BC\u00BD\u00BE\u00BF\u00D7\u00F7\\u005c\u00a0\u00ad\u000a\u0009]";
        //u002E - unicode for dot
        var pattern = "[’‚“”„†‡‰‹›♠♥♣♦‾←→↓↑™\u0023\u0024\u0025\u0026\u003F\u0040\u005E\u002B\u002F\u003B\u003D\u003C\u003E\u0060\u007B\u007C\u007D\u007E\–\—\u00A1\u00A2\u00A3\u00A4\u00A5\u00A6\u00A7\u00A8\u00A9\u00AA\u00AB\u00AC\u00AE\u00AF\u00B0\u00B1\u00B2\u00B3\u02CA\u00B5\u00B6\u00B7\u00B8\u00B9\u00BA\u00BB\u00BC\u00BD\u00BE\u00BF\u00D7\u00F7\\u005c\u00a0\u00ad\u000a\u0009]";

        var flag = true;
        var resultString = "";
        var re = new RegExp(pattern);
        while (flag) {
            var m = re.exec(searchText);
            if (m == null) {
                flag = false;
            } else {
                for (i = 0; i < m.length; i++) {
                    if (m[i] == "	") {
                        if (resultString.indexOf("Tab") == -1) {
                            resultString = resultString + "Tab" + ", ";
                        }
                    }
                    else {
                        if (resultString.indexOf(m[i]) == -1) {
                            resultString = resultString + m[i] + ", ";
                        }
                    }
                }
                searchText = searchText.substring(m.index + 1);
                flag = true;
            }
        }
        if (resultString.length > 0) {

            ShowAlert("Invalid characters in search term:\n" + resultString.substring(0, resultString.length - 2) + " ", "Search");
            return true;
        }
        return false;
    }
};

//$(document).ready(function () {
//    MVUtils.trackSessionExpire();
//});
//TO be Removed Later. Placed Temporarily to avid any breaks
function ajax(options) {
    var settings = {
        type: 'GET',
        traditional: false,
        cache: false,
        dataType: "json",
        timeout: 300000,
        error: function (xhr, status, errorText) { UnblockUI(); if (xhr.status == "403") ShowAlert("You do not have permissions to execute this", "MediaValet"); }
    };
    $.extend(settings, options);
    settings.url = settings.url + '&time=' + new Date().getTime();
    $.ajax(options);
}
function PreloadImages() {

    images = new Array();
    images[0] = "img1.jpg"
    images[1] = "img2.jpg"
    images[2] = "img3.jpg"
    images[3] = "img4.jpg"
    images[4] = "img5.jpg"


}
//Alam: Method for creating a global spinner
var loaderTime, divElement;
function RotateImage() {
    var Cnt = 1;
    divElement = document.createElement('center');
    divElement.id = 'divSpinner';
    var spinnerImage = document.createElement('img');
    spinnerImage.id = 'spinnerImage';
    divElement.appendChild(spinnerImage);
    //divElement.setAttribute('class', 'spinnerClass');
    divElement.style.position = 'absolute';
    divElement.style.width = '100%';
    divElement.style.zindex = '10000';
    //    divElement.style.zindex = '20000';
    var docheight = $(document).height();
    var winheight = $(window).height();
    if (docheight < winheight)
        divElement.style.top = docheight / 2 + 'px';
    else
        divElement.style.top = (winheight / 2 - 20) + 'px';

    document.body.appendChild(divElement);
    loaderTime = setInterval(function () {
        var imgsrc = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/images/MV-Loading0";
        spinnerImage.src = imgsrc + (Cnt) + ".png";
        //spinnerImage.src = imageArray[Cnt];
        if (Cnt > 7)
            Cnt = 0;
        Cnt++;
    }, 500);
}

function StartSpinner(startLoader) {

    if (startLoader) {
        RotateImage();
    }
    else {
        //try {
        clearInterval(loaderTime);
        var elem = document.getElementById("divSpinner");
        if (elem != null) // divElement != "undefined")
            document.body.removeChild(divElement);
        //} catch (e) {
        //}
    }
}



(function ($) {
    $.fn.mvcheckbox = function (options) {
        var opts = $.extend({}, $.fn.mvcheckbox.defaults, options);
        return this.each(function (vIndex) {
            var objects = $(this);
            $(this).addClass("mvcheckbox");
            $(this).attr('checked', false);
            $(this).unbind('click');
            $(this).click(function () {
                var groupName = $(this).attr('group');
                if (!groupName) {
                    $(this).toggleClass("mvcheckbox_on");
                    if ($(this).hasClass('mvcheckbox')) $(this).attr('checked', false);
                    if ($(this).hasClass('mvcheckbox_on')) $(this).attr('checked', true);
                } else {
                    $(".mvcheckbox_on[group=" + groupName + "]").each(function (sIndex) { if (objects[sIndex] != this) $(this).toggleClass("mvcheckbox_on"); });
                    $(this).toggleClass("mvcheckbox_on");
                }
            });
        });
    };
    $.fn.mvcheckbox.defaults = {
        animate: false
    };
})(jQuery);