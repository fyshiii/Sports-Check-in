import hashlib
parmStr="20220321001133883hello45741564fXrxvZ08ML9oNV_RqkOF"
if isinstance(parmStr,str):
        # 如果是unicode先转utf-8
        parmStr=parmStr.encode("utf-8")
m = hashlib.md5()
m.update(parmStr)
print(m.hexdigest())