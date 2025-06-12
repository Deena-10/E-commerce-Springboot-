package demo.webproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import demo.webproject.Entity.Product;
import demo.webproject.repository.ProductRepository;
import jakarta.transaction.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            product.setImg(updatedProduct.getImg());
            return productRepository.save(product);
        }).orElse(null);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Product updateStock(Long productId, int newStock) {
        return productRepository.findById(productId).map(product -> {
            product.setStock(newStock);
            return productRepository.save(product);
        }).orElse(null);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Atomically decreases (or increases) stock by qty.
     * @param productId product ID
     * @param qty negative to decrease, positive to increase
     * @return true if update successful, false if insufficient stock or not found
     */
    @Transactional
    public boolean decreaseStock(Long productId, int qty) {
        return productRepository.decreaseStockIfAvailable(productId, qty) > 0;
    }
}
