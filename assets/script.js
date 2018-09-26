var destination = ["MGM", "JNU", "PHX", "LIT", "SMF", "DEN", "BDL", "TLH", "ATL", "HNL", "BOI",
    "SPI", "IND", "DSM", "FOE", "SDF", "BTR", "AUG", "BWI", "BOS",
    "LAN", "MSP", "JAN", "MCI", "MSO", "LNK", "CSN", "CON", "SAF", "ALB",
    "RDU", "MOT", "CMH", "OKC", "PDX", "PVD", "CAE",
    "PIR", "BNA", "AUS", "SLC", "BTV", "RIC", "SEA", "CRW", "ATW", "CPR"]

var rand = destination[Math.floor(Math.random() * destination.length)];
console.log(rand);

// On Search Click Function
$("#search").on('click', function () {

    event.preventDefault()



    //Variables
    var hotelLocation = rand;
    var checkIn = $("#startDate").val();
    var checkOut = $("#endDate").val();
    var hotelMax = $("#hotelValue").val();
    var hotelLimit = "200";
    var totalprice = "";
    var startDate = $("#startDate").val();        //moment().format("YYYY-MM-DD");
    var endDate = $("#endDate").val();;



    var url = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?";
    url += $.param({
        'apikey': "EmDOcfSCAlzNC04MzGctWtQbvZ9CdI0T",
        'origin': "EWR",
        'destination': rand,
        'departure_date': startDate,
        'return_date': endDate,
        'number_of_results': 1
    });

    //API Key for Amadeus for Hotels
    var urls = "https://api.sandbox.amadeus.com/v1.2/hotels/search-airport";
    urls += '?' + $.param({
        'apikey': "EmDOcfSCAlzNC04MzGctWtQbvZ9CdI0T",
        'location': hotelLocation,
        'check_in': checkIn,
        'check_out': checkOut,
        'number_of_results': 1
    });


    if (hotelMax < hotelLimit) {
        alert("Hotel: Please enter a value greater than 200");

        return;
    }

    $.ajax({
        url: url,
        method: "GET"

    }).then(function (response) {
        $("#duration td").remove();
        $("#depart td").remove();
        $("#returnFlight td").remove();
        $("#seats td").remove();
        $("#flightPrice td").remove();

        for (var i = 0; i < response.results.length; i++) {
            var price = response.results[i].fare.total_price;


            var itin = response.results[i].itineraries;
            for (var x = 0; x < response.results[i].itineraries.length; x++) {
                var outDur = itin[x].outbound.duration;
                var inDur = itin[x].inbound.duration;

                var flightOut = response.results[i].itineraries[x].outbound.flights
                for (var y = 0; y < flightOut.length; y++) {
                    var outDepart = flightOut[y].departs_at;
                    var outArrive = flightOut[y].arrives_at;
                    var outSeat = flightOut[y].booking_info.seats_remaining;

                    var flightIn = response.results[i].itineraries[x].inbound.flights
                    for (var z = 0; z < flightIn.length; z++) {
                        var inDepart = flightIn[z].departs_at;
                        var inArrive = flightIn[z].arrives_at;
                        var inSeat = flightIn[z].booking_info.seats_remaining;
                    }
                }

            }




            $("#duration").append("<td>" + outDur + "</td>" + "<td>" + inDur + "</td>");
            $("#depart").append("<td>" + outDepart + "</td>" + "<td>" + inDepart + "</td>");
            $("#returnFlight").append("<td>" + outArrive + "</td>" + "<td>" + inArrive + "</td>");
            $("#seats").append("<td>" + outSeat + "</td>" + "<td>" + inSeat + "</td>");
            $("#flightPrice").append("<td>" + price + "</td>");




        }




    });



    $.ajax({
        url: urls,
        method: "GET"
    }).then(function (response) {
        $("#hotelName td").remove();
        $("#hotelAdd td").remove();
        $("#price td").remove();
        

        for (var i = 0; i < response.results.length; i++) {
            var propertyName = response.results[i].property_name;
            var addressStreet = response.results[i].address.line1;
            var postalCode = response.results[i].address.postal_code;
            var totalPrice = response.results[i].total_price.amount;
            

            $("#hotelName").append("<td>" + propertyName + "</td>");
            $("#hotelAdd").append("<td>" + addressStreet + " " + postalCode + "</td>");
            $("#price").append("<td>" + totalPrice + "</td>");

        }
    });
});