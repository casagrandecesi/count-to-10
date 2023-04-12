import os

def cifra(parola):
    return "".join(chr(ord(l) + 3) for l in parola)

with open("parole.txt") as f:
    s = f.read()

parole = s.split("\n")
cifrato = "PAROLE = [\n" + "\n".join('"' + cifra(p) + '",' for p in parole) + "\n]"
print(cifrato)

with open(os.path.join("..", "www", "js", "parole.js"), "w") as f:
    f.write(cifrato)



