m=round(jet(255)*255);
string='[';
for i=1:255
    string=[string  '"rgb('  num2str(m(i,1))  ','  num2str(m(i,2))  ','  num2str(m(i,3))  ')", '];
end
string=[string  ']'];