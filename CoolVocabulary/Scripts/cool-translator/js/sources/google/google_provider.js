/**
 * Created by wsbaser on 25.03.2015.
 */
function GoogleProvider(config){
    DictionaryProvider.call(this,config);
}

GoogleProvider.prototype = Object.create(DictionaryProvider.prototype);

GoogleProvider.prototype.convertGoogleResponseToValidJson = function(googleResponse){
    return googleResponse.replace(/\[,/g,'[null,').replace(/,,+/g,',null,').replace(/,\]/g,',null]')
};

GoogleProvider.prototype.processResponse = function(response) {
    var arrayString = this.convertGoogleResponseToValidJson(response);
    arrayString = arrayString.replace(new RegExp('\'', 'g'), '&apos;');
    console.log(arrayString);
    try {
        var arr = JSON.parse(arrayString);
    }
    catch(e) {
        console.error('GoogleServer.processResponse: unable to parse json. ' + arrayString);
        throw new Error('Error. Invalid server response.');
    }
    var jsonObject = {};

    try {
        jsonObject.word = arr[1][0][3];
    }
    catch (e){
        return null;
    }

    // .TRANSLATIONS
    try {
        jsonObject.translations = {};
        var translations = arr[1] || [];
        for (var i = translations.length - 1; i >= 0; i--) {
            var sp = SpeachParts.parseEn(translations[i][0]);
            jsonObject.translations[sp] = $.map(translations[i][2], function (entry) {
                return {
                    word: entry[0],
                    reverse_translation: entry[1],
                    score: entry[3] || 0
                }
            });
        }; 
    }
    catch (e) {
        console.error(e);
    }
    
    // .DEFINITIONS
    try {
        jsonObject.definitions = {};
        var definitions = arr[10] || [];
        for (var i = definitions.length - 1; i >= 0; i--) {
            var sp = SpeachParts.parseEn(definitions[i][0]);
            jsonObject.definitions[sp] = $.map(definitions[i][1], function (item) {
                return {
                    definition: item[0],
                    example: item[2]
                };
            }).filter(function(item){
                return item.definition && item.definition.length>10 &&
                    item.example && item.example.length>10;
            }); 
        };
    }
    catch (e) {
        console.error(e);
    }

    // .EXAMPLES
    try {
        jsonObject.examples = $.map(arr[11][0], function (item) {
            return item[0];
        }).filter(function(item){
            return item && item.length>10;
        });
    }
    catch (e) {
        jsonObject.examples = [];
    }
    return jsonObject;
};

GoogleProvider.prototype.makeRequest = function(urlTemplate, requestData) {
};

GoogleProvider.prototype.requestTranslationsData = function(requestData) {
    var self = this;
    var deferred = $.Deferred();
    requestData = Object.create(requestData);
    requestData.tk = this.TL(requestData.word);
    var translateUrl = this.formatRequestUrl(this.config.ajax.translate, requestData);
    console.log(translateUrl);
    $.ajax(translateUrl,{dataType:'text'}).done(function (data) {
        try{
            deferred.resolve(self.processResponse(data));
        }
        catch(e){
            deferred.reject(e.message);
        }
    }).fail(function (jqXHR) {
        self.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred.promise();
};

GoogleProvider.prototype.TL = function(a) {
    var SL = null;
    var QL = function(a) {
            return function() {
                return a;
            };
        };
    var RL = function(a, b) {
      var t ='a',Tb='+';
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2);
            d = d >= t ? d.charCodeAt(0) - 87 : Number(d);
            d = b.charAt(c + 1) == Tb ? a >>> d : a << d;
            a = b.charAt(c) == Tb ? a + d & 4294967295 : a ^ d;
        }
        return a;
    };
    var b, c,
        cb='&',
        k='',
        mf='=',
        Vb="+-a^+6",
        Ub='+-3^+b+-f',
        dd='.';
    if (null  === SL) {
        c = QL(String.fromCharCode(84));
        b = QL(String.fromCharCode(75));
        c = [c(), c()];
        c[1] = b();
        SL = Number(window[c.join(b())]) || 0;
    }
    b = SL;
    d = QL(String.fromCharCode(116)); 
    c =QL(String.fromCharCode(107));
    d = [d(), d()];
    d[1] = c();
    for (c = cb + d.join(k) + mf, d = [], e = 0, f = 0; f < a.length; f++) {
        var g = a.charCodeAt(f);
        if(128 > g){ 
           d[e++] = g; 
        }else{
          if(2048 > g){
            d[e++] = g >> 6 | 192; 
          }
          else{ 
            if(55296 == (g & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512)){
              g = 65536 + ((g & 1023) << 10) + (a.charCodeAt(++f) & 1023);
              d[e++] = g >> 18 | 240;
              d[e++] = g >> 12 & 63 | 128;
            }
            else{
              d[e++] = g >> 12 | 224;
              d[e++] = g >> 6 & 63 | 128;
              d[e++] = g & 63 | 128;
            }
          }
        }
    }
    a = b || 0;
    for (e = 0; e < d.length; e++){
        a += d[e];
        a = RL(a, Vb);
    }
    a = RL(a, Ub);
    if(0 > a){
      a = (a & 2147483647) + 2147483648;
    }
    a %= 1E6;
    return (a.toString() + dd + (a ^ b));
};