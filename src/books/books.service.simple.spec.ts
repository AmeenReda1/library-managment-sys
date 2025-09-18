import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BadRequestException } from '@nestjs/common';
import { BookRepository } from './repositories/book.repository';

// Simple mock for BookRepository
const mockBookRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    saveOne: jest.fn(),
    findOneOrThrow: jest.fn(),
    findOneAndUpdate: jest.fn(),
    repository: {}, // For pagination
};

describe('BooksService', () => {
    let service: BooksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BooksService,
                {
                    provide: BookRepository,
                    useValue: mockBookRepository,
                },
            ],
        }).compile();

        service = module.get<BooksService>(BooksService);

        // Reset all mocks
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create method - ISBN validation', () => {
        it('should throw BadRequestException when ISBN already exists', async () => {
            // Arrange
            const createBookDto = {
                title: 'Test Book',
                author: 'Test Author',
                ISBN: 1234567890,
                description: 'Test Description',
                shelf_location: 'A1',
                available_quantity: 5,
            };

            const existingBook = { id: 1, ISBN: 1234567890 };
            mockBookRepository.findOne.mockResolvedValue(existingBook);

            // Act & Assert
            await expect(service.create(createBookDto)).rejects.toThrow(BadRequestException);
            await expect(service.create(createBookDto)).rejects.toThrow('Book already exists');

            // Verify the ISBN check was called
            expect(mockBookRepository.findOne).toHaveBeenCalledWith({
                where: { ISBN: createBookDto.ISBN }
            });
        });

        it('should call repository methods in correct order when creating new book', async () => {
            // Arrange
            const createBookDto = {
                title: 'New Book',
                author: 'New Author',
                ISBN: 9876543210,
                description: 'New Description',
                shelf_location: 'B2',
                available_quantity: 3,
            };

            const newBook = { id: 2, ...createBookDto };

            mockBookRepository.findOne.mockResolvedValue(null); // ISBN not found
            mockBookRepository.create.mockResolvedValue(newBook);
            mockBookRepository.saveOne.mockResolvedValue(newBook);

            // Act
            const result = await service.create(createBookDto);

            // Assert
            expect(mockBookRepository.findOne).toHaveBeenCalledWith({
                where: { ISBN: createBookDto.ISBN }
            });
            expect(mockBookRepository.create).toHaveBeenCalledWith(createBookDto);
            expect(mockBookRepository.saveOne).toHaveBeenCalledWith(newBook);
            expect(result).toBe(newBook);
        });
    });

    describe('findOneById method', () => {
        it('should call repository with correct ID', () => {
            // Arrange
            const bookId = 123;
            const mockBook = { id: bookId, title: 'Test Book' };
            mockBookRepository.findOneOrThrow.mockResolvedValue(mockBook);

            // Act
            service.findOneById(bookId);

            // Assert
            expect(mockBookRepository.findOneOrThrow).toHaveBeenCalledWith({
                where: { id: bookId }
            });
        });
    });

    describe('update method', () => {
        it('should call repository with correct parameters', async () => {
            // Arrange
            const bookId = 456;
            const updateData = { title: 'Updated Title', author: 'Updated Author' };
            const updatedBook = { id: bookId, ...updateData };

            mockBookRepository.findOneAndUpdate.mockResolvedValue(updatedBook);

            // Act
            const result = await service.update(bookId, updateData);

            // Assert
            expect(mockBookRepository.findOneAndUpdate).toHaveBeenCalledWith(
                { where: { id: bookId } },
                updateData
            );
            expect(result).toBe(updatedBook);
        });
    });
});
