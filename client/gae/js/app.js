$(document).ready(function(){
    //theme the table:
    //$("table thead").addClass("ui-widget-header");
    //$("table body").addClass("ui-widget-content");
    //fill the table
    //alert(newrow);
    /*data = new Array(5);
    data['time'] = '10:00:00';
    data['provider'] = 'Openshift';
    data['language'] = 'php 5.2';
    data['platform'] = 'nginx';
    data['req_per_sec'] = '1.23';*/
    addNewRow({
        'id':'1',
        'time':'10:00:00',
        'provider':'Google',
        'language':'php 5.3',
        'platform':'nginx',
        'req_per_sec':'1.56',
        
        });
});

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});


function ajaxShowDetails(id)
{
    config = {
        url: "json_get_details?id=" + id,
        data: {},
        type: "GET",
        dataType: "json",
        success: function (json){
            alert(json);
            },
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        },
         complete: function( xhr, status ) {
                alert( "The request is complete!" );
            }     
        };
    
    $.ajax(config);
}

function ajaxDoTest()
{
    config = {
        url: "json_do_test",
        type: "GET",
        data: {provider:'openshift:php,google:php'},
        dataType: "json",
        success: function (json){
            alert(json);
            },
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        },
         complete: function( xhr, status ) {
                alert( "The request is complete!" );
            }     
        };
    
    $.ajax(config);
}

    
function addNewRow(data)
{
    //alert(data['time']);
    //create html for the new row
    newrow = '<tr>';
    newrow+='<td>' + data['time'] + '</td>' +
    '<td>' + data['provider'] + '</td>' +
    '<td>' + data['language'] + '</td>' +
    '<td>' + data['platform'] + '</td>' +
    '<td>' + data['req_per_sec'] + '</td>' +
    "<td><a href='#' onclick=\"ajaxShowDetails('" + data['id'] + "');\">Click</a></td>";
    newrow+='</tr>';
    $("#results tr:last").after(newrow);
    //$("#results > tbody:last").append(newrow);
    
    //remove these css classes from <a>: ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only
    //ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only
    /*$("#results a").each(function() {
        //alert( $(this).attr('href'));
        //alert ($(this).hasClass('ui-button'));
        
        $(this).removeClass('ui-button');
        $(this).removeClass('ui-widget');
        $(this).removeClass('ui-state-default');
        $(this).removeClass('ui-corner-all');
        $(this).removeClass('ui-button-text-only');
        
    });*/
}
/*$().ready(function(){
 $(".jtable th").each(function(){
 
  $(this).addClass("ui-state-default");
 
  });
 $(".jtable td").each(function(){
 
  $(this).addClass("ui-widget-content");
 
  });
 $(".jtable tr").hover(
     function()
     {
      $(this).children("td").addClass("ui-state-hover");
     },
     function()
     {
      $(this).children("td").removeClass("ui-state-hover");
     }
    );
 $(".jtable tr").click(function(){
   
   $(this).children("td").toggleClass("ui-state-highlight");
  });
 
}); 
*/

//<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-6808883-6', 'hostmetric.appspot.com');
  ga('send', 'pageview');

//</script>
