[Back](../README.md)

# Communication between systems

## Comunicacao sincrona e assíncrona

- consistencia eventual
- Grupos facebook exemplo


## REST

- Representational State Transfer
- Simplicidade
- Stateless
- Cacheavel

### Niveis de maturidade (Richardson Maturity Model)

#### Nivel 0 
- The Swamp of POX
- nenhuma padronizacao
#### Nivel 1
- Utilizacao de resources

| HTTP Verb | URI | Operation |
| --- | --- | --- |
| GET | /products | Search products |
| GET | /products/{id} | Search product by id |
| POST | /products | Create product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

#### Nivel 2
- Utiliza verbos HTTP

| HTTP Verb | Usage |
| --- | --- |
| GET | Get information about a resource |
| POST | Create a resource |
| PUT | Update a resource |
| DELETE | Delete a resource |

#### Nivel 3
- HATEOAS: Hypermedia as the Engine of Application State
Example:
- HTTP/1.1 200 OK
- Content-Type: application/json
```json
{
  "account": {
    "id": "12345",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "account_number": "123456789",
    "balance": {
      "amount": "100.00",
      "currency": "USD"
    },
    "links": {
      "deposit": "/accounts/12345/deposit",
      "withdraw": "/accounts/12345/withdraw",
      "transfer": "/accounts/12345/transfer",
      "close": "/accounts/12345/close"
    }
  }
}
```

### Niveis de maturidade (Richardson Maturity Model)




