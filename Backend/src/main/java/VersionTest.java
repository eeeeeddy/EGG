import org.springframework.core.SpringVersion;

public class VersionTest {
    public static void main(String[] args) {
        String springVersion = SpringVersion.getVersion();
        System.out.println("Spring Framework 버전: " + springVersion);
    }
}
