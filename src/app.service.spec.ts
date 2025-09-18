import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getHello', () => {
        it('should return "Hello World!"', () => {
            // Act
            const result = service.getHello();

            // Assert
            expect(result).toBe('Hello World!');
        });

        it('should return a string', () => {
            // Act
            const result = service.getHello();

            // Assert
            expect(typeof result).toBe('string');
        });

        it('should not return null or undefined', () => {
            // Act
            const result = service.getHello();

            // Assert
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
        });

        it('should always return the same value', () => {
            // Act
            const result1 = service.getHello();
            const result2 = service.getHello();
            const result3 = service.getHello();

            // Assert
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);
            expect(result1).toBe('Hello World!');
        });
    });
});
