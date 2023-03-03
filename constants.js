var constants = {
    SYSTEM: {
        APPLICATION_NAME: "Zohan The Barber Shop",
        APPLICATION_VERSION: "1.0.0",
        DATABASE_VERSION: "107", 
    },
    PATHS: {
        LOG_FILE_PATH: __dirname + '/logs/logs.txt',
        LOG_FILE_DIR: __dirname + '/logs'
    },

    CRITERIAS: {
        USERNAME: "USERNAME",
        EMAIL: "EMAIL",
        PSW: "PSW",
        PHONE: "PHONE",
        ROLE: "ROLE",
        ID: "ID",
        USER_ID: "USER_ID",
        DAY_TIME_ID: "DAY_TIME_ID",
        ORDER_USER_ID: "ORDER_USER_ID",
        ORDER_SERVICE_ID: "ORDER_SERVICE_ID"
    },
    COOKIES: {
        SESSION_ID: "SESSION_ID"
    },
    ERRORS: {
        ERROR: "ERROR",
        DUPLICATE_ENTRY: 'Duplicate entry',
        DUPLICATE_KEY: 'duplicate key',
        TABLE_: "Table",
        DOESNT_EXISTS: "doesn't exist"
    },
    ERRORS_TRANSLATED: {
        DUPLICATE_ENTRY_CELLPHONE: 'Telefone já cadastrado',
        USER_NOT_FOUND: "Usuário não encontrado",
        BARBER_NOT_FOUND: "Barbeiro não encontrado",
        SERVICE_NOT_FOUND: "Serviço não encontrado",
        DAY_TIME_ALREADY_INSERTED: "Horário indisponível, tente outro horário!",
        PASSWORD_OR_PHONE_WRONG: "Telefone ou senha incorretos",
        PASSWORD_DONT_MATCH: "A senha atual enviada não corresponde a senha salva",
        DAY_NOT_INSERTED: "Dia não cadastrado",
        NO_AVAILABLE_SCHEDULE: "Horários esgotados! Escolha outro dia"
    },
    ROLES: {
        USER: "USER",
        ADMIN: "ADMIN",
        BARBER: "BARBER"
    },
    DEFAULT_DATA: {
        PHONE: "(99) 9 9999-9999",
        ONE_TO_SIX: "123456"
    },
    KEYS: {
        DATE: "DATE",
        SCHEDULE_LIST: "SCHEDULE_LIST"
    }
}

module.exports.constants = constants;