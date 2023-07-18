var http = require('http');
http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)
    res.write("\
% Input the parameter\n\
Variables={'x1','x2', 's1', 's2', 'sol'};\n\
Cost=[-5 -6 0 0 0];\n\
Info=[-1 -1; -4 -1];\n\
B=[-2; -4];\n\
s=eye(size(Info,1));\n\
A=[Info s B];\n\
% To find the strating BFS\n\
BV=[];\n\
for j=1:size(s,2)\n\
    for i=1:size(A,2)\n\
        if A(:,i)==s(:,j)\n\
            BV=[BV i]\n\
        end\n\
    end\n\
end\n\
fprintf('Basic variable (BV)=')\n\
disp(Variables(BV))\n\
\n\
ZjCj=Cost(BV)*A-Cost\n\
\n\
ZCj=[ZjCj; A];\n\
SimplexTable=array2table(ZCj);\n\
SimplexTable.Properties.VariableNames(1:size(ZCj,2))=Variables\n\
%Dual Simplex method\n\
 Run=true\n\
 while Run\n\
sol=A(:,end)\n\
if any(sol<0)\n\
    fprintf('The current BFS is not feasible \n')\n\
    % Finding the leaving variable\n\
    [Leaving_value, pvt_Row]=min(sol)\n\
    fprintf('Leaving row = %d row \n', pvt_Row)\n\
    % Finding the entering variable\n\
    Row=A(pvt_Row,1:end-1);\n\
    ZRow=ZjCj(:,1:end-1);\n\
    for i=1:size(Row,2)\n\
        if Row(i)<0\n\
            ratio(i)=abs(ZRow(i)./Row(i))\n\
        else\n\
            ratio(i)=Inf\n\
        end\n\
    end\n\
    % To finding the minimum ratio\n\
    [MinRatio, pvt_Col]=min(ratio);\n\
    fprintf('Entering variable is %d \n',pvt_Col)\n\
    BV(pvt_Row)=pvt_Col\n\
    fprintf('Basic variable (BV)=')\n\
    disp(Variables(BV))\n\
    % Pivot Key\n\
    pvt_Key=A(pvt_Row, pvt_Col)\n\
    % Update the table\n\
    A(pvt_Row,:)=A(pvt_Row,:)./pvt_Key\n\
    for i=1:size(A,1)\n\
        if i~=pvt_Row\n\
            A(i,:)=A(i,:)-A(i,pvt_Col).*A(pvt_Row,:)\n\
        end\n\
        ZjCj=ZjCj-ZjCj(pvt_Col).*A(pvt_Row,:)\n\
        ZCj=[ZjCj;A];\n\
        SimpTab=array2table(ZCj);\n\
        SimpTab.Properties.VariableNames(1:size(ZCj,2))=Variables\n\
    end\n\
 else\n\
     Run=false\n\
     fprintf('The current BFS is feasible and optimal')\n\
 end\n\
 end\n\
 % Final optimal Solution\n\
 Final_BFS=zeros(1,size(A,2));\n\
 Final_BFS(BV)=A(:,end)\n\
 Final_BFS(end)=-sum(Final_BFS.*Cost)\n\
 OptimalBFS=array2table(Final_BFS);\n\
 OptimalBFS.Properties.VariableNames(1:size(Final_BFS,2))=Variables\n\
              ");
    res.end();
}).listen(process.env.PORT || 3000);
