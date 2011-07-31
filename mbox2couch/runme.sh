ruby getapachemboxlist.rb

for file in *.mbox
do 
python jsonify_mbox.py "$file" > "$file".json 
done

for file in *.json
do 
python couch_bulk_upload.py "$file"
done