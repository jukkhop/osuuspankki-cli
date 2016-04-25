var page = require('webpage').create();
var system = require('system');

var url = 'https://www.op.fi/op?id=10000&_nfpb=true';
var username;
var pass;
var phase = 0;

// Get username and pass from arguments
if (system.args.length == 3) {
    username = system.args[1];
    pass = system.args[2];
    
} else {
    console.log('Invalid arguments.');
    phantom.exit();
}

// Open url
page.open(url);

// Page load finished
page.onLoadFinished = function(status) {
    page.injectJs('jquery-2.2.3.min.js');

    phase++;

    if (phase == 1) {
        page.evaluate(function(username, pass) {
            $('#kayttajatunnus').val(username);
            $('#salasana').val(pass);
            $('input.okNappi').trigger('click');
        }, username, pass);

    } else if (phase == 2) {
        var keyBankNo = page.evaluate(function() {
            return $('.AvainlukuSyotto').html();
        });

        system.stdout.write('Enter key corresponding to ' + keyBankNo + ': ');
        var key = system.stdin.readLine();

        page.evaluate(function(key) {
            $('input[name="avainluku"]').val(key);
            $('input.Nappi').trigger('click');
        }, key);

    } else if (phase == 3) {
        page.evaluate(function() {
            var i = 0;
            var accounts = $('#tilitBox').find('tr').each(function() {
                if (i++ == 1) {
                    var balance = $('td:nth-of-type(4)').html();
                    console.log(balance);
                }
            });
        });

        phantom.exit();
    }
};

// Print regular console messages
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log(msg);
}