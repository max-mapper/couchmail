require 'nokogiri'
require 'httparty'

baseurl = "http://mail-archives.apache.org/mod_mbox/couchdb-user"
html = HTTParty.get(baseurl).body

doc = Nokogiri::HTML.parse(html)

links = doc.css('.links').map do |link|
  puts "wget #{baseurl}/#{link}.mbox" if link = link.attr('id')
end

