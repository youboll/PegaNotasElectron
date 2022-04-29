import requests
import math
import argparse
arg = argparse.ArgumentParser()
arg.add_argument("-n", "--nota", required=True,
   help="Caminho para o XML da nota fiscal")
arg.add_argument("-o", "--output", required=True,
   help="PDF")


def pegaNota(file):
   files=[
      ('xml[]',('ATACADAO S.A. MS 1.186.653.xml',open(file,'rb'),'text/xml'))
   ]  
    
   payload={'enviar_xml': 'DANFE/DACTE'}
   headers = {
   'referer': 'https://www.danfeonline.com.br/',
   'Cookie': 'DANFEONLINE_SESS_ID=a8949e35ff53228a1c9d7ecb996126d3'
   }

   url = "https://www.danfeonline.com.br/arquivo"
   r = requests.request("POST", url, headers=headers, data=payload, files=files)
   return(r)
args = vars(arg.parse_args())
argpdf = args['output']
namePdf = argpdf.replace('%20',' ')
print(namePdf)
args['nota'] = args['nota'].replace('%20',' ')
pdfFile = open(namePdf,'wb')
pdfFile.write(pegaNota(args['nota']).content)
pdfFile.close()