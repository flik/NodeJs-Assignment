var http = require('http'); 
var fs = require('fs');
const { parse } = require('querystring');


function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

http.createServer(function (request, res) {
     
  if (request.url == '/sale') {

    if (request.method == 'POST') {
        collectRequestData(request, result => {
            console.log(result);
            res.end('Order received and processed. Click browser back button for more orders');
            let newLine = []

            newLine.push(result.cars+','+result.location+','+result.salesmen+','+result.price) 

            fs.appendFile('sales.csv', newLine.join(',')+ '\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
 
        });
 
      }
      
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="sale" method="post" >');
    res.write('<label for="cars">Choose a car:</label><br>');
    res.write('<select id="cars" name="cars"> <option value="DCF12094">Honda</option> <option value="BZS96667">Toyota</option> <option value="CAE23401">Mitsubishi</option> </select>');
    res.write('<br><br><label for="cars">Choose a Location:</label><br>');
    res.write('<select id="location" name="location"> <option value="lahore">Lahore</option> <option value="karachi">Karachi</option> <option value="islamabad">Islamabad</option> </select>');
    res.write('<br><br><label for="cars">Choose a Salesmen:</label><br>');
    res.write('<select id="salesmen" name="salesmen"> <option value="QASIM123">Qaism Ahmed</option> <option value="OMAR345">Omar Asim</option> <option value="JANKHAN115">Jaan Khan</option> </select>');

    res.write('<br><br><label>Price: </label> <input type="text" name="price" value=""><br>');
    res.write('<br><br><input type="submit" value="Order">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);