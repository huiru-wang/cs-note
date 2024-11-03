
# SQL Database

SQL: Structured Query Language
- MySQL
- PostgreSQL

1. SQL Database use Table Model for data storage and they use SQL as a query language.
2. Great for transactions, complex queries and integrity.
3. ACID compliant.

#TODO 

# NoSQL Database

NoSQL: Not Only Structured Query Language

1. NoSQL Database encompassed a variety of data models. 
	- Redis: Key-value Model ( In-Memory Database)
	- MongoDB: Document Model
	- ClickHouse: Column-Family Model
	- Graph Model
2. In order to achieve better performance and scalability, immediate data consistency may be sacrificed to some extent, and data updates may not take effect immediately on all nodes.
3. The query methods of NoSQL database vary according to the data model.


# ACID Properties

Atomicity
- Transactions are all or nothing.
Consistency
- After a transaction, the database should be in a consistent state.
Isolation
- Transaction should be independent.
Durability
- Once transaction is committed the data is there to stay.


# Scaling Database

## Vertical Scaling

1. Increasing CPU power
2. Adding more RAM
3. Adding more disk storage
4. Upgrading network
## Horizontal Scaling

1. Database sharding [[01-Sharding]]
2. Replication [[02-Replication]]

# Database Performance

1. Caching
2. Indexing
	- MySQL-InnoDB
3. Query Optimization
	- Explain Plan



























