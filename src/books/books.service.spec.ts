import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BookRepository } from './repositories/book.repository';
import { BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

describe('BooksService', () => {
    let service: BooksService;
    let mockBookRepository: jest.Mocked<BookRepository>;

    // Mock data - Create a proper Book entity mock
    const mockBook: Partial<Book> = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        ISBN: 1234567890,
        description: 'Test Description',
        shelf_location: 'A1',
        available_quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        borrowings: [],
    };

    const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        ISBN: 1234567890,
        description: 'Test Description',
        shelf_location: 'A1',
        available_quantity: 5,
    };

    beforeEach(async () => {
        // Create mock repository
        const mockRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            saveOne: jest.fn(),
            findOneOrThrow: jest.fn(),
            findOneAndUpdate: jest.fn(),
            repository: {},
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BooksService,
                {
                    provide: BookRepository,
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<BooksService>(BooksService);
        mockBookRepository = module.get(BookRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    describe('findOneById', () => {
        it('should call repository.findOneOrThrow with correct parameters', () => {
            // Arrange
            const bookId = 1;
            mockBookRepository.findOneOrThrow.mockResolvedValue(mockBook as Book);

            // Act
            service.findOneById(bookId);

            // Assert
            expect(mockBookRepository.findOneOrThrow).toHaveBeenCalledWith({
                where: { id: bookId }
            });
        });

        it('should return the book from repository', async () => {
            // Arrange
            const bookId = 1;
            mockBookRepository.findOneOrThrow.mockResolvedValue(mockBook as Book);

            // Act
            const result = await service.findOneById(bookId);

            // Assert
            expect(result).toBe(mockBook);
        });
    });

    describe('create', () => {
        it('should create a new book when ISBN does not exist', async () => {
            // Arrange
            mockBookRepository.findOne.mockResolvedValue(null); // ISBN not found
            mockBookRepository.create.mockResolvedValue(mockBook as Book);
            mockBookRepository.saveOne.mockResolvedValue(mockBook as Book);

            // Act
            const result = await service.create(createBookDto);

            // Assert
            expect(mockBookRepository.findOne).toHaveBeenCalledWith({
                where: { ISBN: createBookDto.ISBN }
            });
            expect(mockBookRepository.create).toHaveBeenCalledWith(createBookDto);
            expect(mockBookRepository.saveOne).toHaveBeenCalledWith(mockBook);
            expect(result).toBe(mockBook);
        });

        it('should throw BadRequestException when ISBN already exists', async () => {
            // Arrange
            mockBookRepository.findOne.mockResolvedValue(mockBook as Book); // ISBN already exists

            // Act & Assert
            await expect(service.create(createBookDto)).rejects.toThrow(BadRequestException);
            await expect(service.create(createBookDto)).rejects.toThrow('Book already exists');
        });
    });

    describe('update', () => {
        it('should call repository.findOneAndUpdate with correct parameters', async () => {
            // Arrange
            const bookId = 1;
            const updateDto: UpdateBookDto = { title: 'Updated Title' };
            mockBookRepository.findOneAndUpdate.mockResolvedValue(mockBook as Book);

            // Act
            await service.update(bookId, updateDto);

            // Assert
            expect(mockBookRepository.findOneAndUpdate).toHaveBeenCalledWith(
                { where: { id: bookId } },
                updateDto
            );
        });

        it('should return the updated book', async () => {
            // Arrange
            const bookId = 1;
            const updateDto: UpdateBookDto = { title: 'Updated Title' };
            const updatedBook = { ...mockBook, title: 'Updated Title' };
            mockBookRepository.findOneAndUpdate.mockResolvedValue(updatedBook as Book);

            // Act
            const result = await service.update(bookId, updateDto);

            // Assert
            expect(result).toBe(updatedBook);
        });
    });
});
