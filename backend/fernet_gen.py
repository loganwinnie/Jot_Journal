from cryptography.fernet import Fernet

from config import bcolors

key = Fernet.generate_key()
print(bcolors.BLUE + str(key) + bcolors.ENDC)
