<p align="center">
<img src="Preview.png?raw=true"></img>
</p>

# Justice Kitchen

Justice Kitchen is an open-source platform for creating local directories of Black-owned restaurants or other Black-owned businesses. This readme aims to make it easy to set up a Justice Kitchen site in your own community. Creating your own version of the site is easy, requiring two major steps:

## Data Preparation

### 1. Gathering the data
All the listings in Justice Kitchen are generated from data stored as a JSON file (content.json), which can be easily generated from a Google Sheet. For example, Dallas data is drawn from [this spreadsheet](https://docs.google.com/spreadsheets/d/1IGP0DQ9henUsGmpqLdINxo9V2xNVirBj98uQpay_pIM/edit?usp=sharing). The Codebook tab of the spreadsheet should help explain the format for some of the fields needed.

To collect data within your community, it can be helpful to use a [Google Form similar to this one](https://docs.google.com/forms/d/e/1FAIpQLSf2xRPHNpI4lFWYTsvmwf5_TBTcWXr7dZvMDQMN64XOEz0qgg/viewform?usp=sf_link) (do not submit responses, thank you).

### 2. Geocoding locations

Geocoding (turning locations into values of latitude and longitude) can be done many ways. I use a Google Sheets add-on called [Geocode by Awesome Table](https://gsuite.google.com/marketplace/app/geocode_by_awesome_table/904124517349).

### 3. Exporting the data

To export the spreadsheet data to a JSON, I use a Google Sheets add-on called [Export Sheet Data](https://gsuite.google.com/marketplace/app/export_sheet_data/903838927001?pann=cwsdp&hl=en). Download the file and use it to replace content.json.





## Site Configuration

Configuring a Justice Kitchen site takes just a few simple steps.

### 1. Setting up API keys
The platform currently uses two API keys, both contained in index.html: Google Analytics and Google Maps Javascript API.
- You can create a Google Analytics tag [using these instructions](https://support.google.com/analytics/answer/1008080) and replace the dummy tag (see below)).

    <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=YOURGOOGLEANALYTICS"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
    
        gtag('config', 'YOURGOOGLEANALYTICS');
      </script>

- You can get a Google Maps Javascript API key [using these instructions](https://developers.google.com/maps/documentation/javascript/get-api-key) and replace the dummy key below. Note: Google offers a $200 credit for trying out this API, but it is not free. If you anticipate a large volume of traffic to your site, include limits to avoid billing surprises.

      <script src="https://maps.googleapis.com/maps/api/js?key=YOURMAPSAPIKEY&callback=initPage&libraries=geometry"></script>

### 2. Changing localized content
Currently, some content in index.html reflects Dallas specifically or credits related to our instance of Justice Kitchen. Replace these to better represent your community.

### 3. Hosting
Because Justice Kitchen is a static site, it can be hosted on any website hosting platform. I like AWS best because it keeps costs down, but it can be complex for beginners. [Here is a tutorial]([https://medium.com/@itsmattburgess/hosting-a-https-website-using-aws-s3-and-cloudfront-ee6521df03b9](https://medium.com/@itsmattburgess/hosting-a-https-website-using-aws-s3-and-cloudfront-ee6521df03b9)) for hosting the site the way I did.


## License and Credits
This work is released under the GNU General Public License v2.0. Addendum: uses or derivatives of this code base must be used in support of BIPOC or AAPI communities. If in doubt, ask at [@coreyaustinhere](https://twitter.com/coreyaustinhere).

Original Dallas restaurant data provided by Rosin Saez, Dalila Thomas, Abby Blasingame, and Scott Luther. Strategy by Helina Seyoum, Trey Green, Trent Walters, and Chris Ferrel. Code by Corey Austin.
