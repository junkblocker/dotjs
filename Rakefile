require 'erb'

desc "Install dotjs"
task :install => 'install:all'

DAEMON_INSTALL_DIR = ENV['PREFIX'] || "/usr/local/bin"

namespace :install do
  task :all => [ :prompt, :daemon, :create_dir, :agent, :chrome, :certificate, :done ]

  task :prompt do
    puts "\e[1m\e[32mdotjs\e[0m"
    puts "\e[1m-----\e[0m"
    puts "I will install:"
    puts
    puts "1. djsd(1) in #{DAEMON_INSTALL_DIR}"
    puts "2. and load com.github.dotjs in ~/Library/LaunchAgents"
    puts "3. a trusted self-signed certificate"
    puts
    print "Ok? (y/n) "

    begin
      until %w( k ok y yes n no ).include?(answer = $stdin.gets.chomp.downcase)
        puts "(psst... please type y or n)"
        puts "Install dotjs? (y/n)"
      end
    rescue Interrupt
      exit 1
    end

    exit 1 if answer =~ /n/
  end

  task :done do
    if system("curl -k https://localhost:3131 &> /dev/null")
      puts "\e[1m\e[32mdotjs installation worked\e[0m"
      puts "open https://localhost:3131 in chrome to enable ssl"
      puts "then drop files like google.com.js in ~/.js and enjoy hacking the web"
    else
      puts "\e[31mdotjs installation failed\e[0m"
      puts "check console.app or open an issue"
    end
  end

  desc "Install launch agent"
  task :agent do
    plist = "com.github.dotjs.plist"
    agent_dir = File.expand_path("~/Library/LaunchAgents/")
    agent = File.join(agent_dir, plist)
    Dir.mkdir(agent_dir) unless File.exists?(agent_dir)
    File.open(agent, "w") do |f|
      f.puts ERB.new(IO.read(plist)).result(binding)
    end

    chmod 0644, agent
    puts "starting djsd..."
    sh "launchctl unload #{agent}"
    sh "launchctl load -w #{agent}"
    # wait for server to start
    sleep 5
  end

  desc "Install dotjs daemon"
  task :daemon => :install_dir_writeable do
    cp "bin/djsd", DAEMON_INSTALL_DIR, :verbose => true, :preserve => true
  end

  desc "Create ~/.js"
  task :create_dir do
    if !File.directory? js_dir = File.join(ENV['HOME'], ".js")
      mkdir js_dir
      chmod 0755, js_dir
    end
  end

  desc "Install Google Chrome extension"
  task :chrome do
    puts "", "\e[31mIMPORTANT!\e[0m Install the Google Chrome extension:"
    puts "http://bit.ly/dotjs", ""
  end

  desc "Generate and install a self-signed certificate"
  task :certificate do
    require "openssl"

    ssl_key = ssl_cert = nil

    home_path = ENV.fetch("HOME")
    config_path = File.join(home_path, ".config", "dotjs")
    ssl_key_path = File.join(config_path, "server.key")
    ssl_cert_path = File.join(config_path, "server.crt")

    if File.exist? ssl_key_path and File.exist? ssl_cert_path
      ssl_key = OpenSSL::PKey.read(IO.read(ssl_key_path))
      ssl_cert = OpenSSL::X509::Certificate.new(IO.read(ssl_cert_path))
    end

    unless ssl_key and ssl_cert
      ssl_key = OpenSSL::PKey::RSA.generate(2048)

      ssl_cert = OpenSSL::X509::Certificate.new
      ssl_cert.version = 2
      ssl_cert.serial = 1
      ssl_cert.subject = ssl_cert.issuer = OpenSSL::X509::Name.new([["CN", "localhost"]])
      ssl_cert.public_key = ssl_key.public_key
      ssl_cert.not_before = Time.now
      ssl_cert.not_after = Time.now + (5 * 360 * 24 * 3600)

      ef = OpenSSL::X509::ExtensionFactory.new
      ef.subject_certificate = ssl_cert
      ef.issuer_certificate  = ssl_cert

      ssl_cert.add_extension(ef.create_extension("subjectAltName", "DNS: localhost,IP: 127.0.0.1,IP: ::1", false))
      ssl_cert.add_extension(ef.create_extension("basicConstraints","CA:TRUE",true))
      ssl_cert.add_extension(ef.create_extension("subjectKeyIdentifier","hash",false))
      ssl_cert.add_extension(ef.create_extension("authorityKeyIdentifier","keyid:always",false))
      ssl_cert.sign ssl_key, OpenSSL::Digest::SHA256.new

      system "mkdir", "-p", config_path
      IO.write(ssl_key_path, ssl_key.to_pem, :perm => 0600)
      IO.write(ssl_cert_path, ssl_cert.to_pem)
    end

    system "security", "add-trusted-cert", "-r", "trustRoot", "-p", "ssl", "-p", "basic", "-k", File.join(home_path, "Library", "Keychains", "login.keychain"), ssl_cert_path
  end
end

desc "Uninstall dotjs"
task :uninstall => 'uninstall:all'

namespace :uninstall do
  task :all => [ :prompt, :daemon, :agent, :chrome, :done ]

  task :prompt do
    puts "\e[1m\e[32mdotjs\e[0m"
    puts "\e[1m-----\e[0m"
    puts "I will remove:", ""
    puts "1. djsd(1) from #{DAEMON_INSTALL_DIR}"
    puts "2. com.github.dotjs from ~/Library/LaunchAgents"
    puts "3. The 'dotjs' Google Chrome Extension",""
    puts "I will not remove:", ""
    puts "1. ~/.js", ""
    print "Ok? (y/n) "

    begin
      until %w( k ok y yes n no ).include?(answer = $stdin.gets.chomp.downcase)
        puts "(psst... please type y or n)"
        puts "Uninstall dotjs? (y/n)"
      end
    rescue Interrupt
      exit 1
    end

    exit 1 if answer =~ /n/
  end

  task :done do
    if system("curl http://localhost:3131 &> /dev/null")
      puts "\e[31mdotjs uninstall failed\e[0m"
      puts "djsd is still running"
    else
      puts "\e[1m\e[32mdotjs uninstall worked\e[0m"
      puts "your ~/.js was not touched"
    end
  end

  desc "Uninstall launch agent"
  task :agent do
    plist = "com.github.dotjs.plist"
    agent = File.expand_path("~/Library/LaunchAgents/#{plist}")
    sh "launchctl unload #{agent}"
    rm agent, :verbose => true
  end

  desc "Uninstall dotjs daemon"
  task :daemon => :install_dir_writeable do
    rm File.join(DAEMON_INSTALL_DIR, "djsd"), :verbose => true
  end

  desc "Uninstall Google Chrome extension"
  task :chrome do
    puts "\e[1mplease uninstall the google chrome extension manually:\e[0m"
    puts "google chrome > window > extensions > dotjs > uninstall"
  end
end

# Check write permissions on DAEMON_INSTALL_DIR
task :install_dir_writeable do
  if not File.writable?(DAEMON_INSTALL_DIR)
    abort "Error: Can't write to #{DAEMON_INSTALL_DIR}. Try again using `sudo`."
  end
end
