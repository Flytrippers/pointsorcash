---
layout: default
title: Points or Cash Calculator
description: Find out whether a travel redemption is a good value or whether you should pay cash.
---

<section class="hero">
    <p class="eyebrow">Free travel rewards calculator</p>
    <h1>Should you use points or cash?</h1>
    <p class="hero-copy">Enter the number of points required, the cash price, and any taxes or fees. We'll compare the redemption against Flytrippers' point valuations for Canada.</p>
</section>

<section class="calculator-card" aria-labelledby="calculator-title">
    <div class="status-banner" id="dataStatus" role="status">Loading current point valuations...</div>

    <form id="pointsCalculator" novalidate>
        <h2 id="calculator-title">Points or Cash</h2>

        <label class="field-row" for="selectProgram">
            <span>Rewards program</span>
            <select name="program" id="selectProgram" disabled>
                <option value="">- Select program -</option>
            </select>
        </label>

        <label class="field-row" for="ptsR">
            <span>Points required for redemption</span>
            <input type="number" id="ptsR" inputmode="numeric" min="0" placeholder="pts/miles">
        </label>

        <label class="field-row" for="fees">
            <span>Cash required for redemption (taxes/fees)</span>
            <input type="number" id="fees" inputmode="decimal" min="0" step="0.01" placeholder="$">
        </label>

        <label class="field-row" for="cash">
            <span>Price if booked with cash only</span>
            <input type="number" id="cash" inputmode="decimal" min="0" step="0.01" placeholder="$">
        </label>

        <div class="result-row" id="ValueifPts" hidden>
            <span>Price equivalent <span class="mobile-only"><br></span>(points + taxes/fees)</span>
            <strong id="ValueifPtsSpan"></strong>
        </div>

        <p class="valuation-note" id="ValueReason" hidden>
            At <span id="whoseVal"><a href="https://flytrippers.com/how-much-are-points-worth-points-valuations-in-canada/">Flytrippers</a></span> valuation of <span id="ValueReasonSPAN"></span>&cent;/pt (<button type="button" id="override">override?</button>)
        </p>

        <label class="field-row" id="customOveride" for="userValuation" hidden>
            <span>Your valuation?</span>
            <input type="number" id="userValuation" inputmode="decimal" min="0" step="0.1" placeholder="&cent;/pt">
        </label>

        <button class="calculate-button" type="submit">Should I use Points or Cash?</button>
    </form>

    <p class="recommendation" id="finalRec" aria-live="polite" hidden></p>
    <div class="secondary-result" id="finalRec_2" hidden>
        <p>This redemption gives you <span id="newVal"></span> &cent;/pt</p>
        <p>vs. valuation of <span id="initVal"></span> &cent;/pt</p>
    </div>
</section>

<section class="site-note">
    <h2>How it works</h2>
    <p>Points are not all worth the same. This calculator compares your redemption against current Canadian travel rewards valuations maintained by Flytrippers.</p>
    <p class="updated-note" id="updatedNote"></p>
</section>

{% comment %}
<?php
/*
 * Points or Cash
 * 
 * New points or cash table for the main page
 * 
 * Load with: [includeme file="/var/www/html/php/pointsorcash.php"] 
 */

?>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HT45MTX5ZR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HT45MTX5ZR');
</script>

<!--<style>
#ValueifPtsSpan{display:inline-block;float:right;font-weight:bold;}
#customOveride, #ValueifPts, #ValueReason, #finalRec, #finalRec_2{display:none;}
#ValueReason, #finalRec, #finalRec_2{text-align:center;padding-top:15px;}
#ptsR input, #cash input, #userValuation input, #fees input{text-align:right;}

#finalRec{font-size:1.5em;}
#finalRec span{font-weight:bold;}

#buttonCalc{
    padding:20px;
    width:100%;
    background-color:#0099FF;
    color:white;
    text-align:center;
}

#override{
    text-decoration:underline;
    font-style: italic;
}

/*Hide the arrow on number field*/
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {-moz-appearance: textfield;}

/*Desktop only code*/
@media (min-width:701px){.mobile-only{display:none;}
#selectProgram{
    width:300px;
    display:inline-block;
    float:right;
}
#ptsR, #cash, #userValuation, #fees{
    width:150px;
    display:inline-block;
    float:right;
}
}
/*Mobile only code*/
@media (max-width:700px){.desktop-only{display:none;}
#selectProgram{
    width:100%;
}
#ptsR, #cash, #userValuation, #fees{
    width:100%;
    display:inline-block;
    float:right;
}
#rPTitle {text-align:center;}
}
</style>-->

<script>
// Category, Brand Name, Program, Value [¢/pt]
var programList = {
'rP1' : ['Airline','American','AAdvantage',1.4],
'rP2' : ['Airline','Air Canada','Aeroplan',1.5],
'rP3' : ['Airline','Cathay Pacific','Asia Miles',1.3],
'rP4' : ['Airline','British Airways','Avios',1.5],
'rP5' : ['Airline','WestJet','Dollars',100],
'rP6' : ['Airline','Air France','Flying Blue',1.2],
'rP7' : ['Airline','KLM','Flying Blue',1.2],
'rP8' : ['Airline','Virgin Atlantic','Flying Club',1.5],
'rP9' : ['Airline','Spirit','Free Spirit',0.4],
'rP10' : ['Airline','Etihad','Guest',1.4],
'rP11' : ['Airline','Singapore','KrisFlyer',1.4],
'rP12' : ['Airline','Avianca','LifeMiles',1.7],
'rP13' : ['Airline','ANA','Mileage Club',1.6],
'rP14' : ['Airline','Alaska','Mileage Plan',1.8],
'rP15' : ['Airline','United','MileagePlus',1.4],
'rP16' : ['Airline','Frontier','Miles',1.1],
'rP17' : ['Airline','Hawaiian','Miles',1.2],
'rP18' : ['Airline','Lufthansa','Miles & More',1.4],
'rP19' : ['Airline','Turkish','Miles&Smiles',1.3],
'rP20' : ['Airline','Qatar','Qmiles',0.8],
'rP21' : ['Airline','Southwest','Rapid Rewards',1.5],
'rP22' : ['Airline','Delta','SkyMiles',1.2],
'rP23' : ['Airline','Korean Air','SKYPASS',1.7],
'rP24' : ['Airline','Emirates','Skywards',1.2],
'rP25' : ['Airline','JetBlue','TrueBlue',1.3],
'rP26' : ['Airline','Porter','VIPorter',1],
'rP27' : ['Hotel','Marriott','Bonvoy',0.9],
'rP28' : ['Hotel','Ritz','Carlton Rewards',0.9],
'rP29' : ['Hotel','Hilton','Honors',0.6],
'rP30' : ['Hotel','Accor','Le Club',2],
'rP31' : ['Hotel','Choice','Privileges',0.6],
'rP32' : ['Hotel','Best Western','Rewards',0.7],
'rP33' : ['Hotel','IHG','Rewards',0.6],
'rP34' : ['Hotel','Radisson','Rewards',0.4],
'rP35' : ['Hotel','Wyndham','Rewards',1.2],
'rP36' : ['Hotel','Hyatt','World of Hyatt',1.8],
'rP37' : ['Other','Air Miles','Air Miles',11],
'rP38' : ['Other','Capital One','Aspire',0.9],
'rP39' : ['Other','CIBC','Aventura',1.1],
'rP40' : ['Other','AMEX','Blue Sky Points',1],
'rP41' : ['Other','Desjardins','Bonusdollars',1],
'rP42' : ['Other','Amtrak','Guest Rewards',2.5],
'rP43' : ['Other','AMEX','Membership Rewards',1.5],
'rP44' : ['Other','AMEX','Membership Rewards Select',1.1],
'rP45' : ['Other','Via Rail','Preference',6],
'rP46' : ['Other','BMO','Rewards',0.7],
'rP47' : ['Other','Laurentian Bank','Rewards',1],
'rP48' : ['Other','MBNA','Rewards',1],
'rP49' : ['Other','National Bank','Rewards',1],
'rP50' : ['Other','RBC','Rewards',1.5],
'rP51' : ['Other','Scotia','Rewards',1],
'rP52' : ['Other','TD','Rewards',0.5]
};

function showCustomValue () {
    document.getElementById('customOveride').style.display = "table-cell";
    document.getElementById('userValuation_td').style.display = "table-cell";
  //Toggle - Don't want toggle is they input stuff there
//   var cusDis = document.getElementById("customOveride");
//   if (cusDis.style.display == "block") {
//     cusDis.style.display = "none";
//   } else {
//     cusDis.style.display = "block";
//   }
};

function calculateValue () {
    //Get the program, pts, cash, user value
    var pts = Number(document.getElementById('ptsR').value);
    var cash = Number(document.getElementById('cash').value);
    var fees = Number(document.getElementById('fees').value);
    var userValue = Number(document.getElementById('userValuation').value);
    var rP = document.getElementById('selectProgram').value;

    //Get our value for the program selected
    if (userValue !== 0) {
        var ptOValue = userValue;
        document.getElementById('whoseVal').innerHTML = 'your';
    } else {
        var ptOValue = programList[rP][3];
    }

    //Calulate the value of pts in cash
    var ptsCashValue = ptOValue/100 * pts + fees;
    //Calculate the new ¢/pt value with fees
    var cppWithFees = ptsCashValue * 100 / pts;

    //When we have all the data to continue
    if (typeof pts !== 'undefined' && typeof cash !== 'undefined' && typeof rP !== 'undefined' && cash !== 0 && pts !== 0){
        if (cash < ptsCashValue){
            console.log('USE CASH');
            var whatToUse = "CASH</span>";
            var valueSaved = '<br>(save $'+Math.round(ptsCashValue - cash)+' worth of points)';
            var newVal = Math.round(cash * 100 / pts*10)/10;
        } else if (cash > ptsCashValue) {
            console.log('USE PTS');
            var whatToUse = "POINTS</span>";
            var valueSaved = '<br>(save $'+Math.round(cash - ptsCashValue)+')';
            var newVal = Math.round(cppWithFees*10)/10;
        } else {
            var whatToUse = "CASH or POINTS</span>";
            var valueSaved = '<br>(same value here)';
            var newVal = Math.round(cppWithFees*10)/10;
        }

    //Show results

    document.getElementById('finalRec').innerHTML = 'RECOMMENDATION: <span class="mobile-only"><br></span><span>USE ' + whatToUse + valueSaved;
    document.getElementById('newVal').innerHTML = newVal;
    document.getElementById('initVal').innerHTML = Math.round(cppWithFees*10)/10;
    document.getElementById('ValueifPtsSpan').innerHTML = '$'+Math.round(ptsCashValue);
    document.getElementById('ValueReasonSPAN').innerHTML = ptOValue;

    document.getElementById('ValueifPts').style.display = "table-cell";
    document.getElementById('ValueReason').style.display = "table-cell";
    document.getElementById('finalRec').style.display = "block";
    document.getElementById('finalRec_2').style.display = "block";
    
    }

};
</script>


<div id="poc_main">
<form>
<p id="rPTitle">Rewards program
<select name="rP" id="selectProgram" onchange="calculateValue();"></p>
<optgroup>
<option value="">- Select program -</option>
<optgroup label="Airlines">
<option value="rP1">AAdvantage (American)</option>
<option value="rP2">Aeroplan (Air Canada)</option>
<option value="rP3">Asia Miles (Cathay Pacific)</option>
<option value="rP4">Avios (British Airways)</option>
<option value="rP5">Dollars (WestJet)</option>
<option value="rP6">Flying Blue (Air France)</option>
<option value="rP7">Flying Blue (KLM)</option>
<option value="rP8">Flying Club (Virgin Atlantic)</option>
<option value="rP9">Free Spirit (Spirit)</option>
<option value="rP10">Guest (Etihad)</option>
<option value="rP11">KrisFlyer (Singapore)</option>
<option value="rP12">LifeMiles (Avianca)</option>
<option value="rP13">Mileage Club (ANA)</option>
<option value="rP14">Mileage Plan (Alaska)</option>
<option value="rP15">MileagePlus (United)</option>
<option value="rP16">Miles (Frontier)</option>
<option value="rP17">Miles (Hawaiian)</option>
<option value="rP18">Miles & More (Lufthansa)</option>
<option value="rP19">Miles&Smiles (Turkish)</option>
<option value="rP20">Qmiles (Qatar)</option>
<option value="rP21">Rapid Rewards (Southwest)</option>
<option value="rP22">SkyMiles (Delta)</option>
<option value="rP23">SKYPASS (Korean Air)</option>
<option value="rP24">Skywards (Emirates)</option>
<option value="rP25">TrueBlue (JetBlue)</option>
<option value="rP26">VIPorter (Porter)</option>
</optgroup>
<optgroup label="Hotels">
<option value="rP27">Bonvoy (Marriott)</option>
<option value="rP28">Carlton Rewards (Ritz)</option>
<option value="rP29">Honors (Hilton)</option>
<option value="rP30">Le Club (Accor)</option>
<option value="rP31">Privileges (Choice)</option>
<option value="rP32">Rewards (Best Western)</option>
<option value="rP33">Rewards (IHG)</option>
<option value="rP34">Rewards (Radisson)</option>
<option value="rP35">Rewards (Wyndham)</option>
<option value="rP36">World of Hyatt (Hyatt)</option>
</optgroup>
<optgroup label="Others">
<option value="rP37">Air Miles (Air Miles)</option>
<option value="rP38">Aspire (Capital One)</option>
<option value="rP39">Aventura (CIBC)</option>
<option value="rP40">Blue Sky Points (AMEX)</option>
<option value="rP41">Bonusdollars (Desjardins)</option>
<option value="rP42">Guest Rewards (Amtrak)</option>
<option value="rP43">Membership Rewards (AMEX)</option>
<option value="rP44">Membership Rewards Select (AMEX)</option>
<option value="rP45">Preference (Via Rail)</option>
<option value="rP46">Rewards (BMO)</option>
<option value="rP47">Rewards (Laurentian Bank)</option>
<option value="rP48">Rewards (MBNA)</option>
<option value="rP49">Rewards (National Bank)</option>
<option value="rP50">Rewards (RBC)</option>
<option value="rP51">Rewards (Scotia)</option>
<option value="rP52">Rewards (TD)</option>
</optgroup></select>

<!--<br><br><br>
<p><span id="ptsR_txt">Points required for redemption</span><input type="number" id="ptsR" placeholder="pts/miles" onchange="calculateValue();"></input></p>
<br>
<p><span id="fees_txt">Cash required for redemption (taxes/fees)</span><input type="number" id="fees" placeholder="$" onchange="calculateValue();"></input></p>
<br>
<p><span id="cash_txt">Price if booked with cash only</span><input type="number" id="cash" placeholder="$" onchange="calculateValue();"></input></p>
<br>
<p id="ValueifPts" >PRICE EQUIVALENT (POINTS + TAXES/FEES)<span id="ValueifPtsSpan"></span></p>
<p id="ValueReason">At <span id="whoseVal"><a href="https://flytrippers.com/how-much-are-points-worth-points-valuations-in-canada/">Flytrippers</a></span> valuation of <span id="ValueReasonSPAN"></span>¢/pt (<a id="override" onclick="showCustomValue();">override?</a>)</p>
<br>
<div id="customOveride">
<p><span id="userValuation_txt">Your valuation?</span><input type="number" id="userValuation" placeholder="¢/pt" onchange="calculateValue();"></input></p>
<br>
</div>-->

<table id="cssTableForData">

<tr>
<td class="col1_dt">Points required for redemption</td> <td class="input_num"><input type="number" id="ptsR" placeholder="pts/miles" onchange="calculateValue();"></input></td>
</tr>

<tr>
<td class="col1_dt">Cash required for redemption (taxes/fees)</td> <td class="input_num"><input type="number" id="fees" placeholder="$" onchange="calculateValue();"></input></td>
</tr>

<tr>
<td class="col1_dt">Price if booked with cash only</td> <td class="input_num"><input type="number" id="cash" placeholder="$" onchange="calculateValue();"></input></td>
</tr>

<tr>
<td class="col1_dt" id="ValueifPts">PRICE EQUIVALENT <span class="mobile-only"><br></span>(POINTS + TAXES/FEES)</td> <td class="input_num" id="ValueifPtsSpan"></td>
</tr>

<tr>
<td id="ValueReason" colspan="100">At <span id="whoseVal"><a href="https://flytrippers.com/how-much-are-points-worth-points-valuations-in-canada/">Flytrippers</a></span> valuation of <span id="ValueReasonSPAN"></span>¢/pt (<a id="override" onclick="showCustomValue();">override?</a>)</td>
</tr>

<tr>
<td class="col1_dt" id="customOveride">Your valuation?</td><td id="userValuation_td" class="input_num"><input type="number" id="userValuation" placeholder="¢/pt" onchange="calculateValue();"></input></td>
</tr>

</table>
</form>

<style>
#cssTableForData, #cssTableForData tr, #cssTableForData tr td{border:none;}
#customOveride, #ValueifPts, #ValueifPtsSpan, #ValueReason, #finalRec, #finalRec_2, #userValuation_td{display:none;}

.input_num{text-align:right;float:right;padding-right:0px;}

#ptsR, #cash, #userValuation, #fees, #ValueifPtsSpan{text-align:right;float:right;}

#ValueifPtsSpan{padding-right:12px;font-weight:bold;}

#ValueReason, #finalRec, #finalRec_2{text-align:center;padding-top:15px;}
#finalRec{font-size:1.5em;}
#finalRec span{font-weight:bold;}
#buttonCalc{
    padding:20px;
    width:100%;
    background-color:#0099FF;
    color:white;
    text-align:center;
}
#override{text-decoration:underline;font-style: italic;}

/*Hide the arrow on number field*/
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {-moz-appearance: textfield;}

/*Desktop only code*/
@media (min-width:701px){.mobile-only{display:none;}
#selectProgram{
    width:300px;
    display:inline-block;
    float:right;
}
#ptsR, #cash, #userValuation, #fees, #ValueifPtsSpan{
    width:150px;
    display:inline-block;
    float:right;
}
}
/*Mobile only code*/
@media (max-width:700px){.desktop-only{display:none;}
#rPTitle{font-size:0.9em;}
#selectProgram{font-size:0.9em;}

.col1_dt{
    width:65%;
}
#selectProgram{
    width:100%;
}
#ptsR, #cash, #userValuation, #fees, #ValueifPtsSpan{
    width:100%;
    display:inline-block;
    float:right;
}
#rPTitle {text-align:center;}
}
#cssTableForData tr td{padding-top:20px;font-size:0.7em;}
#ValueifPts{font-size:0.6em;}
#finalRec{font-size:1.2em;}
#finalRec_2{font-size:0.9em;}
}
</style>



<div id="buttonCalc" onclick="calculateValue();">Should I use Points or Cash?</div>
<p id="finalRec"></p>
<div id="finalRec_2">
<p>This redemption gives you <span id="newVal"></span> ¢/pt<p>
<p>vs. Valuation of <span id="initVal"></span> ¢/pt</p>
</div>

</div>

{% endcomment %}
