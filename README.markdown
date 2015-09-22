dotjs
=====

dotjs  is a  Google Chrome  extension  that executes
JavaScript files in `~/.js` based on their filename.

If you navigate to `http://github.com/`,  dotjs will
execute   all   `~/.js/github.com/*.js`  files,   in
alphabetical order.

This makes it super  easy to spruce up your favorite
pages using JavaScript. The scripts in `github.com/`
won't be run on sub-domains, like `gist.github.com`,
`dotfiles.github.com`  et c,  where they might wreak
all sorts of havoc from not seeing the kind of pages
they were written for. (*)

If you _want_ to run something on all `*.github.com`
sites; `www.google.com`, `images.google.com`,  et c,
you can put js files in `.google.com` instead. These
will run before more specific files in `google.com`.

For code you want to run on all sites, `ALL/*.js` is
loaded first of all,  all over the web,  meaning you
can stick plugins or helper functions in there.

Bonus:  files  in `~/.js`  have jQuery 1.9  loaded,
regardless  of  whether  the  site  you're  hacking
uses jQuery.

(*) Double Bonus:  A handy tool  for writing scripts
defensively, which automatically check if a page has
all the script's DOM prerequisites before continuing
-- and then helpfully hands you all those nodes in a
well-named, structured manner is `on`, which you can
find and fork here:  https://gist.github.com/3944489

(a cool bonus of this practice, is that it separates
page structure from script code, so you can see what
assumptions about the page break, when sites evolve,
and fix it -- often without needing to change logic)

GreaseMonkey user scripts are great, but you need to
publish them  somewhere and re-publish  after making
modifications. With dotjs, just add or edit files in
`~/.js`.

## Example

    $ cat ~/.js/github.com.js
    // swap github logo with trollface
    $('a[class^=header-logo-]').html(
        $('<img>')
            .attr('src', '//bit.ly/ghD24e')
            .css({'width': 'auto', 'height': '22px'})
        );

![](http://puu.sh/1Kjvw)

## How It Works

Chrome extensions can't access the local filesystem,
so dotjs  runs a tiny  web server on port  3131 that
serves files out of ~/.js.

You don't  have to worry about  starting or stopping
this web server because  we put a pretty great plist
into  ~/Library/LaunchAgents that  handles  all that
for us.

The dotjs Chrome extension then makes ajax requests
to http://localhost:3131/convore.com.js any time you
hit a page on convore.com, for example, and executes
the returned JavaScript.

## Requires

- OS X
- Ruby 1.8
- rake (gem install rake)
- Google Chrome
- `/usr/local/bin` in your $PATH

## Install it

    git clone http://github.com/defunkt/dotjs
    cd dotjs
    rake install

Now open <https://localhost:3131> in Chrome and follow these steps:

- Click the "X" Padlock icon in the address bar
- Click "Certificate Information"
- Drag the large cert icon to your desktop
- Open it with Keychain
- Configure its **Trust** section as shown: http://cl.ly/Pdny

Finally install the Google Chrome extension:

http://bit.ly/dotjs

## Uninstall it

    rake uninstall

## Credits

- Icon: <http://raphaeljs.com/icons/>
- jQuery: <http://jquery.com/>
- Ryan Tomayko for:

> "I almost wish you could just
   stick JavaScript in ~/.js. Do
   you know what I'm saying?"

## Linux

- [dotjs-ubuntu](https://github.com/glenbot/dotjs-ubuntu)

## Windows

- [dotjs-universal](https://github.com/p3lim/dotjs-universal)

## Other Browsers

- [Firefox Add-on](https://github.com/rlr/dotjs-addon)
- [Safari Extension](https://github.com/wfarr/dotjs.safariextension)
- [Fluid UserScript](https://github.com/sj26/dotjs-fluid)
