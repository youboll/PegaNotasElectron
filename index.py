import requests
import math
import argparse
arg = argparse.ArgumentParser()
arg.add_argument("-n", "--nota", required=True,
   help="Caminho para o XML da nota fiscal")
arg.add_argument("-o", "--output", required=True,
   help="PDF")
def pegaNota(file):
    files = {'arquivoXml': open(str(file),'rb')} 
    url = "https://www.webdanfe.com.br/danfe/GeraDanfe.php"
    r = requests.post(url, files=files)
    return(r)
args = vars(arg.parse_args())
argpdf = args['output']
namePdf = argPdf
pdfFile = open(namePdf,'wb')
pdfFile.write(pegaNota(args['nota']).content)
pdfFile.close()