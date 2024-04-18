from os import environ
from dotenv import load_dotenv


### Color class for terminal statement .
class bcolors:
    GREY = "\033[38;5;245m"
    HEADER = "\033[95m"
    BLUE = "\033[38;5;39m"
    CYAN = "\033[38;5;80m"
    RED = "\033[38;5;125m"
    YELLOW = "\033[38;5;178m"
    WHITE = "\033[38;5;180m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


load_dotenv()


JWT_SECRET_KEY = environ.get("JWT_SECRET_KEY", "SECRET")
HASH_ALGORITHM = environ.get("HASH_ALGORITHM", "HS256")
ACCESS_TOKEN_TIME = environ.get("TOKEN_EXPIRES_MIN", 10080)
OPEN_AI_KEY = environ.get("OPEN_AI_KEY")
OPEN_AI_MODEL = environ.get("OPEN_AI_MODEL")
OPEN_AI_REQUEST_PER_HOUR = int(environ.get("OPEN_AI_REQUEST_PER_HOUR", 20))
ENCRYPT_KEY = environ.get("ENCRYPT_KEY", "blahblahblah")
ALLOWED_ORIGIN = environ.get("ALLOWED_ORIGIN", "*")
DATABASE_URL = environ.get("DATABASE_URL", "postgresql:///journalai")

### Printing Env variables on server start
print("")
print(f"{bcolors.UNDERLINE}{bcolors.GREY} CURRENT ENVIORMENT VARIABLES {bcolors.ENDC}")
print("")
print(f"{bcolors.BLUE} HASH_ALGORITHM : {bcolors.CYAN} {HASH_ALGORITHM} {bcolors.ENDC}")
print(f"{bcolors.BLUE} DATABASE_URL : {bcolors.CYAN} {DATABASE_URL} {bcolors.ENDC}")
print(f"{bcolors.BLUE} OPEN_AI_MODEL : {bcolors.CYAN} {OPEN_AI_MODEL} {bcolors.ENDC}")
print(
    f"{bcolors.BLUE} ACCESS_TOKEN_TIME : {bcolors.CYAN} {ACCESS_TOKEN_TIME} {bcolors.ENDC}"
)
print(f"{bcolors.BLUE} ALLOWED_ORIGIN : {bcolors.CYAN} {ALLOWED_ORIGIN} {bcolors.ENDC}")
print(
    f"{bcolors.BLUE} OPEN_AI_REQUEST_PER_HOUR : {bcolors.CYAN} {OPEN_AI_REQUEST_PER_HOUR} {bcolors.ENDC}"
)
print(f"{bcolors.GREY} _______________________________ {bcolors.ENDC}")
print("")
print(
    f"{bcolors.YELLOW} JWT_SECRET_KEY : {bcolors.WHITE} {JWT_SECRET_KEY} {bcolors.ENDC}"
)
print(f"{bcolors.YELLOW} OPEN_AI_KEY : {bcolors.WHITE} {OPEN_AI_KEY} {bcolors.ENDC}")
print(f"{bcolors.YELLOW} ENCRYPT_KEY : {bcolors.WHITE} {ENCRYPT_KEY} {bcolors.ENDC}")
print("")
