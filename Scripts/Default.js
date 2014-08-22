var Make_A_List = {
    ENTER_KEY_CODE: 13,
    Init: function(){
        if ($("#item-list > ul li").length == 0) {
            Make_A_List.createNode(2);
        }
    },
    createNode: function (numNodes) {
        for (var i = 0; i < numNodes; i++) {
            var node = $("#list-item-template li").clone();
            $("#item-list > ul").append(node);
            node.find('input').blur(function () {
                $(this).hide(0);
                $(this).next().find('span').html($(this).val());
                $(this).next().show();
                return false;
            }).keypress(function (e) {
                var moreListItems = ($(this).parent().next().next().prop('tagName') == 'LI');
                if ((e.keyCode == Make_A_List.ENTER_KEY_CODE) && !moreListItems && ($(this).val() != '')) {
                    $(this).hide();
                    $(this).next().find('span').html($(this).val());
                    $(this).next().find('p').show();
                    $(this).parent().next().find('input').show().focus();
                    Make_A_List.createNode(1);
                    return false;
                }
            })
            node.find('p').click(function () {
                $(this).hide(0);
                var val = $(this).prev().val();
                $(this).prev().show(0).focus();
                return false;
            })
            node.find('b').click(function () {
                $(this).parent().parent().remove();
                return false;
            })
        }
    }
}
var app = {
    reset: function() {
        $('.item').val('');
    },
    Init: function () {
        app.reset();
        $("#searchButton").click(function () {
            $("#searchForm").submit();
        })
        $("#userAddress").click(function () {
            app.openAddressForm();
        })
        $("#overlay").click(function () {
            app.closeAddressForm();
            app.closeMakeAList();
        })
        $("#upl_close").click(function () {
            app.closeAddressForm();
        })
        $("#flip-map").click(function () {
            if ($("#flip-map-card").hasClass("map-card")) {
                $("#flip-map-card").removeClass("map-card");
                $(this).html("View on map");
            } else {
                $("#flip-map-card").addClass("map-card");
                $(this).html("View address form");
            }
        })
        /*$("#searchForm").submit(function(e) {
            e.preventDefault();
            window.location = "/nikatBazaar/search/all/" + $("#itemSearchStr").val().replace(" ", "-")
            return false;
        })*/
        $("#category-menu-btn").click(function (e) {
            e.preventDefault();
            $("#category-menu").fadeToggle();
            return false;
        })
        $("#make-a-list-btn").click(function (e) {
            e.preventDefault();
            app.openMakeAList();
            return false;
        })
        $("#close-make-a-list").click(function (e) {
            e.preventDefault();
            app.closeMakeAList();
            return false;
        })
        $("#window-shopping-btn").click(function (e) {
            e.preventDefault();
            return false;
        })
        /* make a list */
        Make_A_List.Init();
        /* /make a list */
        /*  search page */
        $("#s-cat-side-nav a").click(function (e) {
            e.preventDefault();
            $(this).toggleClass("s-selected-category");
        })
        /* /search page */
    },
    openAddressForm: function () {
        $("#overlay").fadeIn(function () {
            $("#userProvidedLocation").css("left", "10%").fadeIn();
        });
    },
    closeAddressForm: function () {
        $("#userProvidedLocation").fadeOut(function () {
            $(this).css("left", "-99999px");
            $("#overlay").fadeOut();
        });
    },
    submitAddressForm: function () {
    },
    openMakeAList: function () {
        $("#overlay").fadeIn(function () {
            $("#make-a-list").fadeIn();
        });
    },
    closeMakeAList: function () {
        $("#make-a-list").fadeOut(function () {
            $("#overlay").fadeOut();
        })
    },
    resize: function () {
        $("#make-a-list").css('height', $(window).height() - 46 + "px")
    }
}
var map = {
    drawMap: function (lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng)
        var mapOptions = {
            center: latLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: "http://www.google.com/mapfiles/dd-start.png",
            title: "Markets near this location",
            draggable: true,
            animation: google.maps.Animation.DROP,
        })
        google.maps.event.addListener(marker, 'dragend', function () {
            map.setCenter(marker.getPosition());
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                latLng: marker.getPosition(),
            },
                function (results, status) {
                    $("#upl_notifications").html("<b>Location set to : </b>" + results[0].formatted_address);
                    $("#userAddress").html(results[0].formatted_address);
                }
            );
        })
    }
}
var locator = {
    html5GeoLoc: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locator.html5GeoLocPos, locator.html5GeoLocError);
        } else {
        }
    },
    html5GeoLocPos: function (position) {
        map.drawMap(position.coords.latitude, position.coords.longitude);
        $.ajax({
            url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=true",
            success: function (result) {
                $("#userAddress").html(result.results[0].formatted_address);
            }
        })
    },
    html5GeoLocError: function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Can not locate market near you if you do not allow application to fetch your location");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable");
                break;
            case error.TIMEOUT:
                alert("Request to obtain location timed out");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknow error occured, could not obtain location");
                break;
        }
    }
}
function OpenPageInPopUp(relativePagePath, pageTitle, width, height, callback) {
     var url = ''; //'<h1>Please wait...</h1>';
    url = relativePagePath.valueOf();
    var aPosition = url.indexOf("MakeList.aspx?");
    if (aPosition > -1) {
        // for edit user popup
        $.nyroModalManual({
            forceType: 'iframe',
            url: relativePagePath,
            bgColor: '#111111',
            minHeight: 150,
            width: width,
            height: height,
            title: pageTitle,
            titleFromIframe: false,
            endRemove: callback,
            endShowContent: function (elts, settings) {
                //amita: added for scrollbar issue
                $("#nyroModalIframe").attr("scrolling", "no");
                $("#nyroModalWrapper").height(settings.height);
                $("div#nyroModalContent").height(settings.height - 30);
                $("div.wrapperIframe").height(settings.height - 20);
            }
        });

    }
    else
        $.nyroModalManual({
            forceType: 'iframe',
            url: relativePagePath,
            bgColor: '#111111',
            minHeight: 150,
            width: width,
            height: height,
            title: pageTitle,
            titleFromIframe: false,
            endRemove: callback,
            endShowContent: function (elts, settings) {
                $("#nyroModalContent").height($("#nyroModalContent").height() - 30);
            }
        });
}
function openpopup(src, title, width, height) {
    OpenPageInPopUp(src, title, width, height);
}

$(function () {
    locator.html5GeoLoc();
    app.Init();
    $(window).resize(function () {
        app.resize();
    })
    $("#make-a-list").css('height', $(window).height() - 46 + "px")
})
