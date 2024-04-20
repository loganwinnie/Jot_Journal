from cryptography.fernet import Fernet
from config import bcolors

""" simple script to create a Fernet key to be used by application"""

key = Fernet.generate_key()
print(bcolors.BLUE + str(key) + bcolors.ENDC)
