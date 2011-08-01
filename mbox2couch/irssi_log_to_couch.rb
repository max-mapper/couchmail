require 'time'
require 'json'

@current_date = Time.parse("Jan 1 1970 12:00")

def parse_messages(line)
  line = safe_encode_utf8(line)
  if line =~ /Day changed/
    @current_date = line[20..-1] 
  end
  return false if line =~ /^---/
  date = Time.parse("#{@current_date} #{line[0..4]}").iso8601
  line = line[6..-1]
  type = case line
  when /^ * [^ ]+ /
    :action_line
  when /^<.[^>]+>/
    :message_line
  end
  return unless type
  return send(type, line).merge({"date" => date}).to_json
end

#14:53:11<+epochwolf> okay... 1) bigness includes guns.
#14:25:02< soulresin> which is why gz came around.
def message_line(line)
  nick, message = /^<.([^>]+)> (.*)$/.match(line).captures
  {"nick" => nick, "message" => message}
end

#15:08:31 * epochwolf pokes soulresin to see if he jiggles
def action_line(line)
  nick, message = /^ \* ([^ ]+) (.*)$/.match(line).captures
  {"nick" => nick, "message" => message}
end

def safe_encode_utf8(text)
  text.force_encoding('ASCII-8BIT').encode("UTF-8", :invalid => :replace, :undef => :replace, :universal_newline => true)
end

File.read(File.join(Dir.pwd, "couchdb.log")).each_line do |line|
  message = parse_messages(line)
  puts "#{message}," if message
end

