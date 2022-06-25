const html = (invoice) => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <script type="text/javascript">
                ${require('./qrcode.js')}
            </script>
            </script>
                <script type="text/javascript">
                ${require('./html5-qrcode.js')}
            </script>
            <style type="text/css">
                #qrcode {
                    text-align: center;
                }
            
                body {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <!-- This is where our QRCode will appear in. -->
            <div id="qrcode"></div>
            
            <script type="text/javascript">
            function getQRCode(text) {
                var element = document.getElementById("qrcode");
                if(element.lastChild)
                element.replaceChild(showQRCode(text), element.lastChild);
                else
                element.appendChild(showQRCode(text));
            }

            getQRCode("${invoice}");
            </script>
        </body>
    </html>
`;

module.exports = html;